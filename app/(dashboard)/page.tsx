'use client';

import * as React from 'react';
import {
    TextField,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import CustomDataGrid from '../components/CustomDataGrid';
import { getSupabaseClient } from '@/app/api/supabase/supabaseClient';
import Stack from "@mui/material/Stack";

export default function AnimePage() {
    const [animeData, setAnimeData] = React.useState<any[]>([]);
    const [filteredData, setFilteredData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchValue, setSearchValue] = React.useState('');
    const [open, setOpen] = React.useState(false); // For dialog open/close
    const [newAnime, setNewAnime] = React.useState({
        name: '',
        description: '',
        author: '',
        rating: '',
    });

    React.useEffect(() => {
        const fetchAnimeData = async () => {
            const supabase = getSupabaseClient();
            try {
                const { data, error } = await supabase
                    .from('anime') // Replace with your table name
                    .select('name, description, author, rating'); // Specify the fields to retrieve

                if (error) {
                    throw new Error(error.message);
                }

                // Map data to include unique IDs (required for DataGrid)
                const formattedData = data.map((item, index) => ({
                    id: index, // Temporary unique ID
                    ...item,
                }));

                setAnimeData(formattedData); // Store fetched data
                setFilteredData(formattedData); // Set initial filtered data
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimeData();
    }, []);

    // Handle search input changes
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchValue(value);

        // Filter animeData based on the search value
        const filtered = animeData.filter(
            (item) =>
                item.name.toLowerCase().includes(value) ||
                item.description.toLowerCase().includes(value) ||
                item.author.toLowerCase().includes(value) ||
                String(item.rating).toLowerCase().includes(value)
        );

        setFilteredData(filtered);
    };

    // Handle opening and closing the dialog
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Handle form input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewAnime((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleAddAnime = async () => {
        const supabase = getSupabaseClient();
        try {
            const { data, error } = await supabase
                .from('anime') // Replace with your table name
                .insert([{ ...newAnime }]); // Insert the new anime into Supabase

            if (error) {
                throw new Error(error.message);
            }

            // Add the new anime to local state
            setAnimeData((prev) => [
                ...prev,
                { id: prev.length, ...newAnime },
            ]);
            setFilteredData((prev) => [
                ...prev,
                { id: prev.length, ...newAnime },
            ]);

            // Clear and close the form
            setNewAnime({ name: '', description: '', author: '', rating: '' });
            handleClose();
        } catch (err: any) {
            console.error('Error adding anime:', err.message);
        }
    };

    // Define the columns for the DataGrid
    const columns = [
        { field: 'name', headerName: 'Anime Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 400 },
        { field: 'author', headerName: 'Author', width: 200 },
        { field: 'rating', headerName: 'Rating', width: 100 },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box sx={{ padding: 2 }}>
            {/* Search Bar */}
            <Stack gap={2} justifyContent="space-between" alignItems="flex-end" direction="row">
                <TextField
                label="Search Anime"
                placeholder="Search by name, description, author, or rating"
                variant="outlined"
                fullWidth
                sx={{marginBottom: 2, flex: 1}}
                value={searchValue}
                onChange={handleSearch} // Trigger filtering on input change
            />
            <Box sx={{ marginBottom: 2, textAlign: 'right' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Add New Anime
                </Button>
            </Box>
            </Stack>

            {/* Data Grid */}
            <CustomDataGrid
                rows={filteredData}
                columns={columns}
                sx={{
                    height: 600,
                    width: '100%',
                    margin: '0 auto',
                }}
            />

            {/* Dialog for Adding a New Anime */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Anime</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Anime Name"
                        name="name"
                        fullWidth
                        variant="outlined"
                        value={newAnime.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        fullWidth
                        variant="outlined"
                        value={newAnime.description}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Author"
                        name="author"
                        fullWidth
                        variant="outlined"
                        value={newAnime.author}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Rating"
                        name="rating"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newAnime.rating}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddAnime} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}