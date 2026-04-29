import { useState, useEffect } from "react";

function App() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState("");;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        let url = "https://expense-tracker-gyk2.onrender.com/expenses?";

        if (categoryFilter) {
          url += `category=${categoryFilter}&`;
        }

        if (sort === "date_desc") {
          url += `sort=date_desc`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setExpenses(data);
      } catch (err) {
        setError("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryFilter, sort]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numbers for amount field
    if (name === 'amount') {
      // Allow only numbers and decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      // Prevent multiple decimal points
      const parts = numericValue.split('.');
      if (parts.length > 2) {
        return; // Don't update if invalid
      }
      setForm({
        ...form,
        [name]: numericValue,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      alert("Amount must be a valid number greater than 0");
      return;
    }

    if (!form.category) {
      alert("Category is required");
      return;
    }

    if (!form.date) {
      alert("Date is required");
      return;
    }

    const key = crypto.randomUUID();

    await fetch("https://expense-tracker-gyk2.onrender.com/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": key,
      },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
      }),
    });

    // refresh manually
    const res = await fetch("https://expense-tracker-gyk2.onrender.com/expenses");
    const data = await res.json();
    setExpenses(data);

    setForm({
      amount: "",
      category: "",
      description: "",
      date: "",
    });
  };

  // total
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // summary
  const summary = expenses.reduce((acc, e) => {
    if (!acc[e.category]) {
      acc[e.category] = 0;
    }
    acc[e.category] += Number(e.amount);
    return acc;
  }, {});

  // styles
  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "8px 12px",
    margin: "5px 5px 5px 0",
    border: "none",
    background: "#007bff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const th = {
    padding: "10px",
    border: "1px solid #ddd",
  };

  const td = {
    padding: "10px",
    border: "1px solid #ddd",
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Expense Tracker</h1>

      {/* FORM */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Add Expense</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="amount"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            style={inputStyle}
          />

          <button style={buttonStyle}>Add Expense</button>
        </form>
      </div>

      {/* CONTROLS */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={inputStyle}
        />

        <button onClick={() => setSort("date_desc")} style={buttonStyle}>
          Sort by Date
        </button>

        <button onClick={() => setSort("")} style={buttonStyle}>
          Clear
        </button>
      </div>

      {/* TOTAL */}
      <h2>Total: ₹{total.toFixed(2)}</h2>

      {/* LOADING + ERROR */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* SUMMARY */}
      <h3>Summary by Category</h3>
      <ul>
        {Object.entries(summary).map(([cat, amt]) => (
          <li key={cat}>
            {cat}: ₹{Number(amt).toFixed(2)}
          </li>
        ))}
      </ul>

      {/* TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={th}>Amount</th>
            <th style={th}>Category</th>
            <th style={th}>Description</th>
            <th style={th}>Date</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                No expenses found
              </td>
            </tr>
          ) : (
            expenses.map((e) => (
              <tr key={e.id}>
                <td style={td}>₹{Number(e.amount).toFixed(2)}</td>
                <td style={td}>{e.category}</td>
                <td style={td}>{e.description}</td>
                <td style={td}>
                  {new Date(e.date).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;