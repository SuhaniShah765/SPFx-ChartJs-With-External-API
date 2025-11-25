import * as React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { IProduct } from "./IProduct";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export const ProductChart: React.FC = () => {
const [products, setProducts] = React.useState<IProduct[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);
  const [values, setValues] = React.useState<number[]>([]);

  const [categories, setCategories] = React.useState<string[]>([]);
  const [brands, setBrands] = React.useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedBrand, setSelectedBrand] = React.useState<string>("all");

  //------------------------------------------------------------------
  // FIRST LOAD → fetch API + set default charts
  //------------------------------------------------------------------
 React.useEffect(() => {
  fetchData().catch(console.error);
}, []);


  //------------------------------------------------------------------
  // RUN FILTER when category/brand changes
  //------------------------------------------------------------------
  React.useEffect(() => {
    if (products.length > 0) {
      filterData();
    }
  }, [selectedCategory, selectedBrand]);

  //------------------------------------------------------------------
  // FETCH DATA + SET DEFAULT GRAPH
  //------------------------------------------------------------------
  const fetchData = async (): Promise<void> => {
    const response = await fetch("https://dummyjson.com/products?limit=100");
    const json = await response.json();

    // Save raw data
    setProducts(json.products);

    // Prepare categories
    const categorySet = new Set(json.products.map((p: IProduct) => p.category));
    const categoryArray: string[] = ["all"];
    categorySet.forEach((c: string) => categoryArray.push(c));
    setCategories(categoryArray);

    // Prepare brands
    const brandSet = new Set(json.products.map((p: IProduct) => p.brand));
    const brandArray: string[] = ["all"];
    brandSet.forEach((b: string) => brandArray.push(b));
    setBrands(brandArray);

    // --------------------------------------------------
    // DEFAULT CHART DATA (first 10 products)
    // --------------------------------------------------
    const defaultLabels = json.products.slice(0, 10).map((p: IProduct) => p.title);
    const defaultValues = json.products.slice(0, 10).map((p: IProduct) => p.price);

    setLabels(defaultLabels);
    setValues(defaultValues);
  };

  //------------------------------------------------------------------
  // FILTER FUNCTION → updates chart data
  //------------------------------------------------------------------
  const filterData = () => {
    let filtered = products.slice();

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    // If filter gives no results, show nothing
    if (filtered.length === 0) {
      setLabels([]);
      setValues([]);
      return;
    }

    // Use first 10 filtered items
    const lbls = filtered.slice(0, 10).map((p) => p.title);
    const vals = filtered.slice(0, 10).map((p) => p.price);

    setLabels(lbls);
    setValues(vals);
  };

  //------------------------------------------------------------------
  // Chart data
  //------------------------------------------------------------------
  const barData = {
    labels,
    datasets: [
      {
        label: "Product Prices",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        label: "Prices",
        data: values,
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56",
          "#4BC0C0", "#9966FF", "#FF9F40",
          "#E91E63", "#00BCD4", "#8BC34A", "#FFC107",
        ],
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Price Trend",
        data: values,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
      },
    ],
  };

  //------------------------------------------------------------------
  // UI
  //------------------------------------------------------------------
  return (
    <div style={{ maxWidth: "100%", padding: 20 }}>
      
      {/* FILTERS */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {/* Category Filter */}
        <div>
          <label><b>Category:</b></label><br />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: 6 }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{(c || "unknown").toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label><b>Brand:</b></label><br />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            style={{ padding: 6 }}
          >
            {brands.map((b) => (
              <option key={b} value={b}>{( b || "unknown").toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CHARTS */}
      <h3>Bar Chart</h3>
      <div style={{ width: "100%", maxWidth: 600 , margin: "0 auto" }}>
        <Bar data={barData} />
      </div>

      <h3 style={{ marginTop: 40 }}>Pie Chart</h3>
      <div style={{ width: "100%", maxWidth: "350px", margin: "0 auto" }}>
        <Pie data={pieData} />
      </div>

      <h3 style={{ marginTop: 40 }}>Line Chart</h3>
      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <Line data={lineData} />
      </div>
    </div>
  );
};
