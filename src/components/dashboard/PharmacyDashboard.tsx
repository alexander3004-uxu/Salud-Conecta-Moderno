import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Search,
  Filter,
  MapPin,
  QrCode,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  ShoppingBag,
  FileSearch,
  CheckCircle
} from 'lucide-react';

export default function PharmacyDashboard() {
  const stats = [
    { label: 'Recetas Pendientes', value: '142', change: '12%', trend: 'up', icon: FileSearch, color: 'text-primary' },
    { label: 'Retiros Hoy', value: '89', change: 'Estable', trend: 'stable', icon: ShoppingBag, color: 'text-on-surface-variant' },
    { label: 'Items Críticos', value: '7', change: 'Revisión Req.', trend: 'down', icon: AlertCircle, color: 'text-tertiary' },
  ];

  const stockItems = [
    { medicine: 'Amoxicilina 500mg', lab: 'PharmaCorp', stock: '12 uds', status: 'Crítico', type: 'error' },
    { medicine: 'Ibuprofeno 400mg', lab: 'MediLife', stock: '45 uds', status: 'Bajo', type: 'warning' },
    { medicine: 'Losartán 50mg', lab: 'CardioMed', stock: '120 uds', status: 'Estable', type: 'success' },
  ];

  const pendingOrders = [
    { id: 'ORD-8942', patient: 'Juan Pérez', items: '2x Enalapril 10mg, 1x Aspirina', time: '15m', status: 'En Preparación', sideColor: 'border-l-secondary' },
    { id: 'ORD-8945', patient: 'María González', items: '1x Insulina Glargina', time: '-5m (Retraso)', status: 'Pendiente', sideColor: 'border-l-error' },
  ];

  const incomingValidations = [
    { id: 'RX-2024-991', doctor: 'Dr. R. Favaloro', center: 'Clínica Bazterrica', status: 'Firma OK', color: 'text-secondary' },
    { id: 'RX-2024-992', doctor: 'Dra. S. Gómez', center: 'Hosp. Italiano', status: 'Duda Dosis', color: 'text-tertiary' },
  ];

  return (
    <div className="w-full flex-grow flex flex-col gap-6">
      {/* Emergency Stock Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-tertiary-container text-on-tertiary-container px-6 py-3 flex items-center justify-between shadow-lg rounded-2xl border border-tertiary/20"
      >
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>Alerta Stock: Amoxicilina 500mg crítico en Zona Norte</span>
        </div>
        <button className="opacity-60 hover:opacity-100 transition-opacity">
          <AlertCircle className="w-4 h-4" />
        </button>
      </motion.div>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 flex flex-col gap-4 shadow-sm"
              >
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{stat.label}</span>
                <div className="flex items-end justify-between">
                  <span className={`text-4xl font-display font-black ${stat.label === 'Items Críticos' ? 'text-tertiary' : 'text-on-surface'}`}>{stat.value}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold mb-1">
                    {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-secondary" />}
                    {stat.trend === 'down' && <AlertTriangle className="w-3 h-3 text-tertiary" />}
                    <span className={stat.trend === 'up' ? 'text-secondary' : stat.trend === 'down' ? 'text-tertiary' : 'text-on-surface-variant'}>{stat.change}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Critical Stock Table */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h2 className="text-xl font-display font-black text-on-surface">Stock Crítico & Alertas</h2>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                Ver Inventario
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/50 border-b border-outline-variant/20">
                    <th className="p-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Medicamento</th>
                    <th className="p-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Laboratorio</th>
                    <th className="p-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Stock</th>
                    <th className="p-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Estado</th>
                    <th className="p-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {stockItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-container transition-colors group">
                      <td className="p-4 text-sm font-bold text-on-surface">{item.medicine}</td>
                      <td className="p-4 text-xs font-medium text-on-surface-variant">{item.lab}</td>
                      <td className={`p-4 text-sm font-black text-right font-display ${item.type === 'error' ? 'text-tertiary' : item.type === 'warning' ? 'text-primary' : 'text-secondary'}`}>{item.stock}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          item.type === 'error' ? 'bg-error-container/20 text-tertiary' : 
                          item.type === 'warning' ? 'bg-primary/10 text-primary' : 
                          'bg-secondary/10 text-secondary'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="bg-surface-container-highest text-on-surface text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-outline-variant/30 hover:bg-primary hover:text-on-primary transition-all">
                          Pedir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-display font-black text-on-surface border-b border-outline-variant/20 pb-4">Pedidos Pendientes para Retiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOrders.map((order, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className={`bg-surface-container-low rounded-3xl p-5 border border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer group flex flex-col gap-4 shadow-sm border-l-4 ${order.sideColor}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{order.id}</span>
                      <h3 className="text-lg font-display font-black text-on-surface mt-1 group-hover:text-primary transition-colors">{order.patient}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      <span className={order.time.includes('-') ? 'text-tertiary' : ''}>{order.time}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-on-surface-variant line-clamp-1">{order.items}</p>
                  <div className="flex justify-between items-center mt-2 pt-4 border-t border-outline-variant/10">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'Pendiente' ? 'text-tertiary' : 'text-primary'}`}>{order.status}</span>
                    <button className="text-primary hover:scale-110 transition-transform">
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Map Card */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden flex flex-col h-[400px] relative shadow-sm">
            <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-surface to-transparent z-10 flex justify-between items-center">
              <h3 className="text-xl font-display font-black text-on-surface">Demanda Zonal</h3>
              <button className="bg-surface/80 p-2 rounded-xl backdrop-blur border border-outline-variant/30 text-on-surface hover:bg-surface transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-full h-full bg-surface-container relative flex items-center justify-center">
              {/* Simulated Map Texture */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-ping" />
                <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-tertiary rounded-full animate-pulse shadow-[0_0_20px_rgba(255,84,70,0.5)]" />
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-secondary rounded-full opacity-50" />
                <MapPin className="absolute top-1/3 left-1/2 w-6 h-6 text-primary" />
              </div>
              <div className="text-center p-8">
                <FileSearch className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Visualización de Demanda</p>
              </div>
            </div>

            <div className="absolute bottom-0 w-full bg-surface-container-low/90 backdrop-blur-md p-4 border-t border-outline-variant/20 flex justify-between items-center">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Activos radio 5km</span>
              <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">Labs: 3 | Farmacias: 12</span>
            </div>
          </div>

          {/* Prescription Validation */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex flex-col gap-6 flex-grow">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
              <h2 className="text-lg font-display font-black text-on-surface">Validación Entrante</h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">3 Nuevas</span>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
              {incomingValidations.map((val, idx) => (
                <div key={idx} className="bg-surface/50 p-4 rounded-2xl border border-outline-variant/10 flex flex-col gap-3 group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">{val.id}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest border border-current px-2 py-0.5 rounded-full ${val.color}`}>
                      {val.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{val.doctor}</p>
                    <p className="text-[10px] font-medium text-on-surface-variant">{val.center}</p>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button className="flex-1 bg-primary text-on-primary py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                      Aprobar
                    </button>
                    <button className="flex-1 border border-outline-variant/30 hover:bg-surface-container-highest text-on-surface py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
