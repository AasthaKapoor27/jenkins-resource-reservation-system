import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Toaster, toast } from "sonner";
import AgentCard from "./components/agents/AgentCard";
import ReservationForm from "./components/reservations/ReservationForm";
import ReservationTable from "./components/reservations/ReservationTable";
import { Server } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

function App() {
  const [agents, setAgents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API}/agents`);
      setAgents(response.data);
    } catch (e) {
      console.error("Error fetching agents:", e);
      toast.error("Failed to fetch agents");
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${API}/reservations`);
      setReservations(response.data);
    } catch (e) {
      console.error("Error fetching reservations:", e);
      toast.error("Failed to fetch reservations");
    }
  };

  const handleReservationCreated = async (reservation) => {
    try {
      const response = await axios.post(`${API}/reservations`, reservation);
      toast.success("Reservation created successfully");
      await fetchReservations();
      await fetchAgents();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to create reservation";
      toast.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchAgents();
      await fetchReservations();
      setLoading(false);
    };
    loadData();
    
    // Refresh agents status every 30 seconds
    const interval = setInterval(() => {
      fetchAgents();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6" />
            <h1 className="font-mono font-bold text-xl tracking-tighter">Jenkins Resource Reservation System</h1>
          </div>
          <p className="text-sm text-neutral-500 mt-1">Resource Reservation System</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Agent Status */}
          <aside className="col-span-1 lg:col-span-3 space-y-4">
            <div className="mb-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-500 mb-4">Agent Status</h2>
            </div>
            <div className="space-y-3">
              {agents.map((agent) => (
                <AgentCard key={agent.name} agent={agent} />
              ))}
            </div>
          </aside>

          {/* Main - Form & Table */}
          <div className="col-span-1 lg:col-span-9 space-y-12">
            {/* Reservation Form */}
            <section>
              <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-500 mb-4">Reservation Command Center</h2>
              <ReservationForm 
                agents={agents} 
                onReservationCreated={handleReservationCreated}
              />
            </section>

            {/* Reservations Table */}
            <section>
              <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-500 mb-4">Data Log</h2>
              <ReservationTable reservations={reservations} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;