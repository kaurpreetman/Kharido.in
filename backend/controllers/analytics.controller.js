import User from '../models/user.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/order.model.js';

export const getAnalyticsData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

        res.status(200).json({
            users: totalUsers,
            products: totalProducts,
            totalSales,
            totalRevenue
        });
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDailySalesData = async (startDate, endDate) => {
    try {
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } },
        ]);

        const dateArray = getDatesInRange(startDate, endDate);

        return dateArray.map(date => {
            const foundData = dailySalesData.find(item => item._id === date);
            return {
                date,
                sales: foundData?.sales || 0,
                revenue: foundData?.revenue || 0,
            };
        });
    } catch (error) {
        console.error("Error fetching daily sales data:", error);
        return [];
    }
};

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}
