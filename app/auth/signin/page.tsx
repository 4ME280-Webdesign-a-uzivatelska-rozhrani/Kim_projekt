'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Alert } from '@mui/material';
import { login } from './actions';
import { useRouter } from 'next/navigation';
import { alpha } from "@mui/material/styles";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            await login(formData);
            // If login succeeds, the server action will redirect
        } catch (err: any) {
            setError(err.message || 'Invalid email or password. Please try again.');
            setLoading(false);
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
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
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
                    disabled={loading}
                />
                <TextField
                    label="Password"
                    fullWidth
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 3 }}
                    disabled={loading}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
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