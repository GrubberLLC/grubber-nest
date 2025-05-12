// filepath: /Users/ennismachta/Grubber-Server/hello.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);


router.post('/find-nearby-places', async (req, res) => {
    try {
        const { latitude, longitude, keyword } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Missing latitude or longitude' });
        }

        // Define the search radius in meters (10 miles = 16,093.4 meters)
        const SEARCH_RADIUS_METERS = 16093.4;

        // Query Supabase to find places within the radius
        let query = supabase
            .from('Places')
            .select(`
                id, name, mainImage, mainImage2, mainImage3, isOpen, 
                addressStreet, addressCity, addressState, addressZip, addressDisplay1, 
                latitude, longitude, phoneNumber, price, businessUrl, 
                foodQualityRating, serviceRating, cleanlinessRating, category, description, googleId
            `)
            .lte(
                'latitude', latitude + 0.15 // Approximate bounding box for optimization
            )
            .gte(
                'latitude', latitude - 0.15
            )
            .lte(
                'longitude', longitude + 0.15
            )
            .gte(
                'longitude', longitude - 0.15
            );

        // Apply keyword filtering if provided
        if (keyword) {
            query = query.or(
                `name.ilike.%${keyword}%,category.ilike.%${keyword}%,description.ilike.%${keyword}%`
            );
        }

        // Execute the query
        let { data, error } = await query;

        if (error) throw error;

        // Calculate distance for each place (client-side since Supabase doesn’t support spatial queries natively)
        data = data
            .map(place => ({
                ...place,
                distance: getHaversineDistance(latitude, longitude, place.latitude, place.longitude)
            }))
            .filter(place => place.distance <= SEARCH_RADIUS_METERS / 1000) // Convert to km
            .sort((a, b) => a.distance - b.distance) // Sort by closest

        res.status(200).json(data.slice(0, 10)); // Return top 10 closest places

    } catch (error) {
        console.error('Error fetching nearby places:', error);
        res.status(500).json({ error: 'Failed to fetch nearby places', details: error.message });
    }
});

// Haversine formula to calculate distance between two points
function getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

module.exports = router;