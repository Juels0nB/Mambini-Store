import type { FC } from "react";
import type { Product } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface ProductCardProps {
    product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState("/placeholder.png");

    useEffect(() => {
        // Usar visible_images se disponível, senão usar images
        const imagesToUse = (product.visible_images && product.visible_images.length > 0) 
            ? product.visible_images 
            : product.images;
        
        if (imagesToUse && imagesToUse.length > 0) {
            const img = imagesToUse[0];

            if (typeof img === "string") {
                if (img.startsWith("http")) {
                    setImageUrl(img);
                } else {
                    setImageUrl(`http://localhost:8000${img}`);
                }
            } else if (img instanceof File) {
                const objectUrl = URL.createObjectURL(img);
                setImageUrl(objectUrl);

                // limpa o URL local para evitar memory leaks
                return () => URL.revokeObjectURL(objectUrl);
            }
        }
    }, [product]);

    return (
        <div
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-3 cursor-pointer"
            onClick={() => navigate(`/detail/${product.id}`)}
        >
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-lg"
                    onError={(e) => {
                        // só troca 1x para evitar loop infinito
                        if (e.currentTarget.src !== window.location.origin + "/placeholder.png") {
                            e.currentTarget.src = "/placeholder.png";
                        }
                    }}
                />
            </div>
            <div className="mt-3">
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <p className="text-gray-600">€{product.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductCard;
