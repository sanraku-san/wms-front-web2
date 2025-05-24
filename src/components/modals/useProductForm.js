    import { useState, useEffect, useRef } from 'react';
    import { getCategories } from '../../api/category';

    export const useProductForm = (isOpen, currentProduct, categories = []) => {
    const initialProduct = {
        name: '',
        barcode: '',
        category_id: '',
        price: '',
        stock: '',
        image: '',
        description: '',
    };

    const [product, setProduct] = useState(currentProduct || initialProduct);
    const [localCategories, setLocalCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const fileInputRef = useRef(null);
    const cachedCategories = useRef([]);
    const hasFetchedCategories = useRef(false);

    useEffect(() => {
        if (isOpen) {
        if (categories.length > 0) {
            setLocalCategories(categories);
            cachedCategories.current = categories;
            hasFetchedCategories.current = true;
        } else if (!hasFetchedCategories.current && cachedCategories.current.length === 0) {
            getCategories()
            .then((data) => {
                setLocalCategories(data.data);
                cachedCategories.current = data.data;
                hasFetchedCategories.current = true;
            })
            .catch((error) => console.error('Error fetching categories:', error));
        } else {
            setLocalCategories(cachedCategories.current);
        }
        } else {
        setLocalCategories([]);
        hasFetchedCategories.current = false;
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
        setProduct(
            currentProduct
            ? {
                ...currentProduct,
                stock: String(currentProduct.stock || ''), // Ensure stock is a string
                price: String(currentProduct.price || ''), // Ensure price is a string
                category_id: String(currentProduct.category_id || ''), // Ensure category_id is valid
                }
            : initialProduct
        );
        setImagePreview(currentProduct && currentProduct.image ? currentProduct.image : null);
        setImageRemoved(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [isOpen, currentProduct]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setImagePreview(URL.createObjectURL(file));
        setProduct({ ...product, image: file });
        setImageRemoved(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setProduct({ ...product, image: '' });
        setImageRemoved(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return {
        product,
        setProduct,
        localCategories,
        imagePreview,
        imageRemoved,
        fileInputRef,
        handleImageChange,
        handleRemoveImage,
    };
    };