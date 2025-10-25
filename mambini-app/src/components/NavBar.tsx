import {AiOutlineClose, AiOutlineMenu, } from "react-icons/ai";
import {useState} from "react";

function NavBar () {


    const [nav, setNav] = useState(false)

    const handleNav =() =>{
        setNav(!nav)
    }


    return (
        <div className=" flex justify-between  items-center px-4 mt-2 max-w-[1240px] mx-auto  text-black">
            <div className=" flex justify-center items-center    ">
                <h1 className="w-full text-3xl font-bold ">MAMBINI STORE</h1>
            </div>
                <div className="flex justify-between items-center ">
                    <ul className="hidden  md:flex ml-70">
                        <li onClick={handleNav} className="p-4">Home</li>
                        <li className="p-4">Shop</li>
                        <input
                            type="text"
                            placeholder="🔍︎ Search"
                            className="rounded-xl"
                        />
                    </ul>
                </div>


            <div onClick={handleNav} className="block md:hidden">
                {nav ? < AiOutlineClose size={20}/>: <AiOutlineMenu size={20} />}
            </div>
            <div className={nav? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-mambini ease-in-out duration-500' : 'fixed left-[-100%] ease-out duration-500 '}>
                <h1 className="w-full text-3xl font-bold text-black m-4 ">MAMBINI STORE</h1>
                <ul className="uppercase p-4">
                    <li className="p-4 border-b border-black">Home</li>
                    <li className="p-4 border-b border-black">Shop</li>
                    </ul>
            </div>
        </div>

    )
}

export default NavBar;


