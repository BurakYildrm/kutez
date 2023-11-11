import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import imagePaths from "~/imagePaths.json";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Badge,
	Divider,
} from "@nextui-org/react";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { BsCartPlus, BsCartDash } from "react-icons/bs";

export const meta: MetaFunction = () => {
	return [
		{ title: "Kutez Remix App" },
		{ name: "description", content: "Kutez demo" },
	];
};

export const loader = async () => {
	return imagePaths;
};

type Category = {
	name: string;
	images: string[];
};

type CartItem = {
	name: string;
	image: string;
	price: number;
};

export default function Index() {
	const imagePaths = useLoaderData<typeof loader>();
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const categories: Category[] = [
		{
			name: "Engagement Ring",
			images: [],
		},
		{
			name: "Pendants",
			images: [],
		},
		{
			name: "bridal set",
			images: [],
		},
	];

	imagePaths.forEach((path: string) => {
		const index = parseInt(path.split("/images/")[1].split("-")[0]);

		if (index < 9) {
			categories[0].images.push(path);
		} else if (index < 17) {
			categories[1].images.push(path);
		} else {
			categories[2].images.push(path);
		}
	});

	categories.forEach((category: Category) => {
		category.images.sort((a: string, b: string) => {
			const aIndex = parseInt(a.split("-")[1]);
			const bIndex = parseInt(b.split("-")[1]);

			return aIndex - bIndex;
		});
	});

	return (
		<div className="h-screen max-w-screen-lg mx-auto">
			<div className="flex flex-col justify-center items-center gap-8 mt-8 mx-8">
				<div className="flex justify-between items-center w-full">
					<h1 className="text-xl font-montserrat">
						MY JEWELRY STORE
					</h1>
					<div className="flex items-center gap-4">
						<img
							src="/assets/search.jpg"
							alt="search"
							className="w-4 h-4 cursor-pointer"
						/>
						<Popover placement="bottom">
							<Badge
								content={cartItems.length}
								showOutline={false}
								className="bg-[#d2d2d2] text-xs w-[15px] h-[15px]"
							>
								<PopoverTrigger>
									<img
										src="/assets/cart.jpg"
										alt="cart"
										className="w-4 h-4 cursor-pointer"
									/>
								</PopoverTrigger>
							</Badge>
							<PopoverContent className="p-4">
								{cartItems.length == 0 ? (
									<p className="text-[15px] font-montserrat text-center">
										Your cart is empty
									</p>
								) : (
									<>
										<div className="flex flex-col gap-4">
											{cartItems.map((cartItem) => (
												<div
													key={cartItem.name}
													className="flex justify-between items-center"
												>
													<img
														src={cartItem.image}
														alt={cartItem.name}
														className="w-20 h-20 rounded-xl object-cover"
													/>
													<div className="flex flex-col ml-4 flex-1">
														<p className="text-[15px] font-montserrat">
															{cartItem.name}
														</p>
														<p className="text-[13px] font-montserrat opacity-50">
															{`$${cartItem.price}.00`}
														</p>
													</div>
													<HiOutlineTrash
														size={25}
														className="ml-8 cursor-pointer trash-icon max-[300px]:ml-2"
														onClick={() => {
															setCartItems(
																(prevItems) =>
																	prevItems.filter(
																		(
																			item
																		) =>
																			item.name !=
																			cartItem.name
																	)
															);
														}}
													/>
												</div>
											))}
										</div>
										<Divider className="my-4" />
										<div className="flex w-full justify-between items-center">
											<p className="text-[15px] font-montserrat">
												Subtotal:
											</p>
											<p className="text-[15px] font-montserrat">
												{`$${cartItems.reduce(
													(
														acc: number,
														item: CartItem
													) => acc + item.price,
													0
												)}.00`}
											</p>
										</div>
									</>
								)}
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-x-4 gap-y-12">
					{categories.map((category) =>
						category.images.map((image, imageIndex) => (
							<div
								className="flex flex-col"
								key={`${category.name}-${imageIndex}`}
							>
								<div className="relative image-container transition-all">
									<img
										src={`${image}`}
										alt={`${category.name} - ${imageIndex}`}
										className="w-full h-full object-cover rounded-xl"
									/>
									<div className="absolute top-2 right-2 bg-[#d2d2d2] rounded-full p-2 cart-icon-container">
										{cartItems.filter(
											(item) => item.image == image
										).length == 0 ? (
											<BsCartPlus
												size={20}
												className="cursor-pointer"
												onClick={() => {
													setCartItems(
														(prevItems) => [
															...prevItems,
															{
																name:
																	category.name +
																	" " +
																	(imageIndex +
																		(category.name ==
																			"Pendants" &&
																		imageIndex >
																			3
																			? 2
																			: 1)),
																image: image,
																price:
																	100 +
																	parseInt(
																		image
																			.split(
																				"/images/"
																			)[1]
																			.split(
																				"-"
																			)[0]
																	),
															},
														]
													);
												}}
											/>
										) : (
											<BsCartDash
												size={20}
												className="cursor-pointer"
												onClick={() => {
													setCartItems((prevItems) =>
														prevItems.filter(
															(item) =>
																item.image !=
																image
														)
													);
												}}
											/>
										)}
									</div>
								</div>
								<p className="text-[15px] font-montserrat mt-3">
									{category.name +
										" " +
										(imageIndex +
											(category.name == "Pendants" &&
											imageIndex > 3
												? 2
												: 1))}
								</p>
								<p className="text-[17px] font-montserrat mt-0.5">
									{`$${
										100 +
										parseInt(
											image
												.split("/images/")[1]
												.split("-")[0]
										)
									}.00 USD`}
								</p>
							</div>
						))
					)}
				</div>
				<div className="flex flex-col justify-center items-center mt-20 mb-32 gap-4">
					<p className="text-[20px] font-zapfhumanst text-center">
						We Contribute to the Global Reforestation
					</p>
					<div className="flex flex-col justify-center items-center">
						<p className="text-[17px] font-zapfhumanst text-center">
							We plant a tree for each order together with One
							Tree Planted, A non-profit Organization{" "}
							<br className="max-md:hidden" /> which proceeds the
							global reforestation act simultaneously in North
							America, Latin America,{" "}
							<br className="max-md:hidden" /> Asia, Africa,
							Europe and the Pacific in 47+ Countries.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
