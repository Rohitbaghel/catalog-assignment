export const generateDummyData = (currentPrice: number) => {
	const data = [];
	const today = new Date();
	let price = currentPrice;

	for (let i = 29; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);

		// Add some random fluctuation to the price
		const change = (Math.random() - 0.5) * 500; // Random change between -250 and 250
		price += change;

		data.push({
			date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
			price: Math.max(0, price) // Ensure price doesn't go negative
		});
	}

	return data;
};
