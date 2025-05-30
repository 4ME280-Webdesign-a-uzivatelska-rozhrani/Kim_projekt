'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { getSupabaseClient } from '@/app/api/supabase/supabaseClient';
import CustomDataGrid from "@/app/components/CustomDataGrid";

interface WatchlistItem {
    id: number; // Unique ID for CustomDataGrid
    anime_id: number;
    anime_name: string;
    status: string;
}

export default function WatchlistPage() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [filteredWatchlist, setFilteredWatchlist] = useState<WatchlistItem[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const supabaseClient = getSupabaseClient();

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);

            // Fetch watchlist items for the current user
            const { data: watchlistData, error } = await supabaseClient
                .from('watchlist')
                .select('anime_id, status'); // Adjust as per your database schema

            if (error) throw error;

            // Fetch anime names for the anime_ids in the watchlist
            const animeIds = watchlistData?.map((item) => item.anime_id) || [];
            const { data: animeData, error: animeError } = await supabaseClient
                .from('anime')
                .select('id, name')
                .in('id', animeIds);

            if (animeError) throw animeError;

            // Map the anime names to the watchlist items
            const formattedData = watchlistData?.map((item, index) => ({
                id: index, // Unique ID for DataGrid
                anime_id: item.anime_id,
                anime_name: animeData?.find((anime) => anime.id === item.anime_id)?.name || 'Unknown', // Fallback if anime name not found
                status: item.status,
            }));

            // @ts-ignore
            setWatchlist(formattedData || []);
            // @ts-ignore
            setFilteredWatchlist(formattedData || []);
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearch(value);

        // Filter watchlist based on search input
        const filtered = watchlist.filter((item) =>
            item.anime_name.toLowerCase().includes(value) || item.status.toLowerCase().includes(value)
        );

        setFilteredWatchlist(filtered);
    };

    // Define DataGrid columns
    const columns = [
        { field: 'anime_name', headerName: 'Anime Name', flex: 1, minWidth: 200 },
        { field: 'status', headerName: 'Status', flex: 1, minWidth: 150 },
    ];

    if (loading) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box
            sx={{
                paddingTop: 2,
            }}
        >
            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <TextField
                    label="Search Anime..."
                    variant="outlined"
                    value={search}
                    onChange={handleSearch}
                    sx={{ flex: 1 }}
                />
                <Button variant="contained" color="primary" href="/watchlist/create">
                    Add New Anime to Watchlist
                </Button>
            </Box>

            {/* CustomDataGrid for Watchlist */}
            <CustomDataGrid
                rows={filteredWatchlist}
                columns={columns}
                sx={{
                    height: 600,
                    width: '100%',
                    margin: '0 auto',
                }}
            />
        </Box>
    );
}