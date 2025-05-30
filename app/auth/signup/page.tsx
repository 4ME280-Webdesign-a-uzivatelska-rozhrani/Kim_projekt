'use client';
import * as React from 'react';
import Link from '@mui/material/Link';
import { Box, Button, Alert, TextField, Typography } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import {alpha} from "@mui/material/styles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function SignInLink() {
    return (
        <span style={{ fontSize: '0.8rem' }}>
      Already have an account?&nbsp;<Link href="/auth/signin">Sign in</Link>
    </span>
    );
}

export default function SignUp() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess('Account created successfully! Please check your email for verification instructions.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
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
            <Typography variant="h4" component="h1" gutterBottom>
                Sign Up
            </Typography>
            {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ marginBottom: 2 }}>
                    {success}
                </Alert>
            )}
            <form onSubmit={handleSignUp}>
                <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    required
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ marginTop: 2 }}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </form>
            <Box mt={2}>
                <SignInLink />
            </Box>
        </Box>
    );
}