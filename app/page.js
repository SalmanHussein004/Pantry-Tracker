// page.js
"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField, Stack, Snackbar, AppBar, Toolbar, Container, Paper, IconButton } from '@mui/material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import './styles.css';  // Import your custom CSS file

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#1e1e1e',
            paper: '#2e2e2e',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export default function Home() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState(1);
    const [itemCost, setItemCost] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'inventory'));
            setInventory(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchInventory();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAddItem = async () => {
        if (!itemName || itemQuantity < 1 || itemCost < 0) {
            setSnackbarMessage('Invalid input data');
            setSnackbarOpen(true);
            return;
        }
        await addDoc(collection(firestore, 'inventory'), { name: itemName, quantity: itemQuantity, cost: itemCost * itemQuantity });
        handleClose();
        setItemName('');
        setItemQuantity(1);
        setItemCost(0); // Reset item cost
        setSnackbarMessage('Item added successfully');
        setSnackbarOpen(true);
        const fetchInventory = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'inventory'));
            setInventory(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchInventory();
    };

    const handleUpdateItem = async (id, quantityChange) => {
        const itemRef = doc(firestore, 'inventory', id);
        const itemDoc = await getDoc(itemRef);

        if (itemDoc.exists()) {
            const currentQuantity = itemDoc.data().quantity;
            const currentCost = itemDoc.data().cost / currentQuantity; // cost per item
            const newQuantity = currentQuantity + quantityChange;

            if (newQuantity < 0) {
                setSnackbarMessage('Quantity cannot be negative');
                setSnackbarOpen(true);
                return;
            }

            const newCost = currentCost * newQuantity;

            await updateDoc(itemRef, { quantity: newQuantity, cost: newCost });
            setSnackbarMessage('Item updated successfully');
            setSnackbarOpen(true);
            const fetchInventory = async () => {
                const querySnapshot = await getDocs(collection(firestore, 'inventory'));
                setInventory(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            };
            fetchInventory();
        } else {
            setSnackbarMessage('No document to update');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteItem = async (id) => {
        await deleteDoc(doc(firestore, 'inventory', id));
        setSnackbarMessage('Item deleted successfully');
        setSnackbarOpen(true);
        const fetchInventory = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'inventory'));
            setInventory(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchInventory();
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Pantry Management
                        </Typography>
                        <Button color="inherit" onClick={handleOpen}>Add Item</Button>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Stack spacing={2}>
                        {inventory.map(item => (
                            <Slide direction="left" in={true} mountOnEnter unmountOnExit key={item.id}>
                                <Paper elevation={3} className="slide-in" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h5">{item.name}</Typography>
                                        <Typography>Quantity: {item.quantity}</Typography>
                                        <Typography>Total Cost: ${(item.cost).toFixed(2)}</Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1}>
                                        <IconButton color="primary" onClick={() => handleUpdateItem(item.id, 1)}>
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleUpdateItem(item.id, -1)}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteItem(item.id)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Stack>
                                </Paper>
                            </Slide>
                        ))}
                    </Stack>
                </Container>
                <Modal open={open} onClose={handleClose}>
                    <Box className="modal-container">
                        <Typography variant="h6">Add New Item</Typography>
                        <TextField
                            className="modal-input"
                            label="Item Name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            className="modal-input"
                            label="Quantity"
                            type="number"
                            value={itemQuantity}
                            onChange={(e) => setItemQuantity(parseInt(e.target.value, 10))}
                        />
                        <TextField
                            className="modal-input"
                            label="Cost per Item"
                            type="number"
                            value={itemCost}
                            onChange={(e) => setItemCost(parseFloat(e.target.value))}
                        />
                        <Button
                            className="modal-input"
                            variant="contained"
                            color="primary"
                            onClick={handleAddItem}
                        >
                            Add Item
                        </Button>
                    </Box>
                </Modal>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
            </Box>
        </ThemeProvider>
    );
}
