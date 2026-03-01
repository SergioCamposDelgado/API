import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DayNightBackground } from "../components/DayNightBackground";
import { useNavigate } from "react-router";
import {
  getCities,
  addCityWithAuth,
  updateCityWithAuth,
  deleteCity,
  type City,
} from "../services/weatherAPI";
import { Plus, Edit2, Trash2, X, LogOut } from "lucide-react";

export function AdminPanel() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    latitud: "",
    longitud: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Cargar ciudades
  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await getCities();
        setCities(data);
      } catch (err) {
        setError("Error al cargar las ciudades");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nombre || !formData.latitud || !formData.longitud) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (!token) {
      setError("Token no disponible");
      return;
    }

    try {
      const cityData = {
        nombre: formData.nombre,
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
      };

      if (editingCity?.id) {
        const updated = await updateCityWithAuth(editingCity.id, cityData, token);
        setCities(cities.map((c) => (c.id === updated.id ? updated : c)));
        setSuccess(`Ciudad "${formData.nombre}" actualizada correctamente`);
      } else {
        const newCity = await addCityWithAuth(cityData, token);
        setCities([...cities, newCity]);
        setSuccess(`Ciudad "${formData.nombre}" creada correctamente`);
      }

      resetForm();
    } catch (err) {
      setError("Error al guardar la ciudad");
      console.error(err);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (!token) {
      setError("Token no disponible");
      return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar esta ciudad?")) {
      return;
    }

    try {
      await deleteCity(id, token);
      setCities(cities.filter((c) => c.id !== id));
      setSuccess("Ciudad eliminada correctamente");
    } catch (err) {
      setError("Error al eliminar la ciudad");
      console.error(err);
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      nombre: city.nombre,
      latitud: city.latitud.toString(),
      longitud: city.longitud.toString(),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      latitud: "",
      longitud: "",
    });
    setEditingCity(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen relative">
      <DayNightBackground />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-6 py-8 flex items-center justify-between max-w-6xl"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#1a202c] dark:text-white">
              Panel de Administración
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Bienvenido, {email}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("email");
              navigate("/login");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </motion.button>
        </motion.header>

        {/* Main Content */}
        <section className="container mx-auto px-6 py-12 max-w-6xl">
          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400"
            >
              {success}
            </motion.div>
          )}

          {/* Add Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-8 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Nueva Ciudad
          </motion.button>

          {/* Form Modal */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={resetForm}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#1a202c] dark:text-white">
                    {editingCity ? "Editar Ciudad" : "Nueva Ciudad"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      placeholder="Ej: Madrid"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* Latitud */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Latitud
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.latitud}
                      onChange={(e) =>
                        setFormData({ ...formData, latitud: e.target.value })
                      }
                      placeholder="Ej: 40.4168"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* Longitud */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Longitud
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.longitud}
                      onChange={(e) =>
                        setFormData({ ...formData, longitud: e.target.value })
                      }
                      placeholder="Ej: -3.7038"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {editingCity ? "Actualizar" : "Crear"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Cities Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Cargando ciudades...
              </div>
            ) : cities.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No hay ciudades registradas
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Nombre
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Latitud
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Longitud
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cities.map((city) => (
                      <tr
                        key={city.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                          {city.nombre}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {city.latitud.toFixed(4)}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {city.longitud.toFixed(4)}
                        </td>
                        <td className="px-6 py-4 flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(city)}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(city.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
