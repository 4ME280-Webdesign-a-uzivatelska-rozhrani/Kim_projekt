'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { login } from './actions'; // Import the server-side login function
import { useRouter } from 'next/navigation';
import {alpha} from "@mui/material/styles";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // To handle redirection upon success

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error before login attempt

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            await login(formData); // Call the login server action
            router.push('/'); // Redirect to home page upon successful login
        } catch (err: any) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <Box
            sx={(theme) => ({
                maxWidth: 400,
                margin: 'auto',
                marginTop: 8,
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
            <Typography variant="h4" component="h1" textAlign="center" mb={3}>
                Sign In
            </Typography>
            {error && (
                <Typography color="error" textAlign="center" mb={2}>
                    {error}
                </Typography>
            )}
            <form onSubmit={handleSignIn}>
                <TextField
                    label="Email"
                    fullWidth
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Password"
                    fullWidth
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sign In
                </Button>
            </form>
            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    Don&apos;t have an account?&nbsp;
                    <Link href="/auth/signup" underline="hover">
                        Sign Up
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}