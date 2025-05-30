'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import {createClient} from "@/utils/supabase/client";
import {getSupabaseClient} from "@/app/api/supabase/supabaseClient";
import {alpha} from "@mui/material/styles";

interface Anime {
    id: number;
    name: string;
}

export default function WatchlistCreatePage() {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [selectedAnime, setSelectedAnime] = useState('');
    const [status, setStatus] = useState('');
    const [newAnimeName, setNewAnimeName] = useState('');
    const [addingNew, setAddingNew] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();
    const supabaseClient = getSupabaseClient();

    useEffect(() => {
        fetchAnimeList();
    }, [supabase]);

    const fetchAnimeList = async () => {
        try {
            const { data, error } = await supabaseClient.from('anime').select('id, name');
            console.log(data)
            if (error) throw error;
            // @ts-ignore
            setAnimeList(data || []);
        } catch (error: any) {
            console.error('Error fetching anime list:', error.message);
        }
    };

    const handleAddToWatchlist = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            let animeId = selectedAnime;

            const { data } = await supabase.auth.getUser()

            // Validate session
            if (!data || !data.user) {
                throw new Error('User not logged in. Please sign in to add to the watchlist.');
            }

            const userId = data.user.id; // Get the user ID from the session

            // Inserting new anime if adding
            if (addingNew && newAnimeName) {
                const { data, error } = await supabase
                    .from('anime')
                    .insert([{ name: newAnimeName }])
                    .select('id, name');

                if (error) throw error;

                animeId = data[0].id;
            }

            // Insert into the watchlist with the `user_id`
            const { error: watchlistError } = await supabase.from('watchlist').insert({
                user_id: userId, // Session-provided user ID
                anime_id: animeId,
                status,
            });

            if (watchlistError) throw watchlistError;

            window.location.href = '/watchlist'; // Redirect to watchlist page
        } catch (error: any) {
            setError(error.message || 'An error occurred while adding to the watchlist.');
        }
    };

    return (
        <Box
            sx={(theme) => ({
                padding: 4,
                backgroundColor: theme.vars
                    ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                    : alpha(theme.palette.background.default, 1),
                borderColor: theme.vars ? theme.vars.palette.divider : theme.palette.divider,
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 2,
                boxShadow: theme.vars ? theme.vars.shadows[1] : theme.shadows[1],
            })}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Add to Watchlist
            </Typography>
            <form onSubmit={handleAddToWatchlist}>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                {!addingNew ? (
                    <TextField
                        label="Select Anime"
                        select
                        required
                        fullWidth
                        value={selectedAnime}
                        onChange={(e) => setSelectedAnime(e.target.value)}
                        sx={{ mb: 2 }}
                    >
                        {animeList.map((anime) => (
                            <MenuItem key={anime.id} value={anime.id}>
                                {anime.name}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <TextField
                        label="New Anime Name"
                        fullWidth
                        required
                        value={newAnimeName}
                        onChange={(e) => setNewAnimeName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                )}
                <TextField
                    label="Status"
                    select
                    required
                    fullWidth
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="Plan to Watch">Plan to Watch</MenuItem>
                    <MenuItem value="Watching">Watching</MenuItem>
                    <MenuItem value="Watched">Watched</MenuItem>
                </TextField>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Add to Watchlist
                </Button>
            </form>
        </Box>
    );
}