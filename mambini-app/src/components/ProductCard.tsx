import type {FC} from "react";
import type {Product} from "../api/productApi";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
    product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-3 cursor-pointer"
            onClick={() => navigate(`/detail/${product.id}`)}
        >
            <div className="relative">
                <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-lg"
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
