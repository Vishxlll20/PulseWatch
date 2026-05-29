import incidentModel from "../models/incident.model.js";
import logModel from "../models/log.model.js";
import monitorModel from "../models/monitor.model.js";

export const getIncidentsForMonitor = async (req, res, next) => {
    try {
        const { monitorId } = req.params;

        // Verify monitor belongs to user
        const monitor = await monitorModel.findOne({ _id: monitorId, userId: req.user._id });
        if (!monitor) return res.status(404).json({ error: "Monitor not found or unauthorized" });

        const { page = 1, limit = 20 } = req.query;
        
        //  PERFORMANCE FIX: use .lean() to make GET requests up to 5x faster by returning pure JSON
        const incidents = await incidentModel.find({ monitorId })
            .sort({ startTime: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();
            
        // Populate logs for each incident
        for (let i = 0; i < incidents.length; i++) {
             const incidentLogs = await logModel.find({ 
                 monitorId, 
                 createdAt: { $gte: incidents[i].startTime, $lte: incidents[i].endTime || new Date() } 
             }).sort({ createdAt: -1 }).limit(10).lean();

             incidents[i].logs = incidentLogs.map(log => ({
                 time: new Date(log.createdAt).toLocaleString(),
                 method: monitor.method || 'GET',
                 path: monitor.url || '/',
                 status: log.statusCode || log.status,
                 message: log.errorMessage || 'OK'
             }));
        }

        if (!incidents) {
            next(new Error('Incidents not found for this monitor'));
        }
        res.json(incidents);
    } catch (err) {
        next(err);
    }
};

export const resolveIncident = async (req, res, next) => {
    try {
        const { incidentId } = req.params;

        const incident = await incidentModel.findById(incidentId);
        if (!incident) {
        return res.status(404).json({ error: "Incident not found" });
        }

        // ownership check
        const monitor = await monitorModel.findOne({
        _id: incident.monitorId,
        userId: req.user._id
        });

        if (!monitor) {
        return res.status(404).json({ error: "Monitor not found or unauthorized" });
        }

        // already resolved check
        if (incident.resolved) {
        return res.status(400).json({ message: "Incident already resolved" });
        }

        // resolve incident
        incident.resolved = true;
        incident.endTime = new Date();
        await incident.save();

        res.json({
        message: "Incident resolved manually",
        incident
        });

    } catch (err) {
        next(err);
  }
};

export const deleteIncidentsForMonitor = async (req, res, next) => {
    try {
        const { monitorId } = req.params;

        // Verify monitor belongs to user
        const monitor = await monitorModel.findOne({ _id: monitorId, userId: req.user._id });
        if (!monitor) return res.status(404).json({ error: "Monitor not found or unauthorized" });

        const result = await incidentModel.deleteMany({ monitorId });
        res.json({ message: `${result.deletedCount} incidents deleted for monitor ${monitorId}` });
    } catch (err) {
        next(err);
    }
};

export const getActiveIncidentForMonitor = async (req, res, next) => {
    try {
        const { monitorId } = req.params;

        // Verify monitor belongs to user
        const monitor = await monitorModel.findOne({ _id: monitorId, userId: req.user._id });
        if (!monitor) return res.status(404).json({ error: "Monitor not found or unauthorized" });

        const incident = await incidentModel.findOne({ monitorId, resolved: false }).sort({ startTime: -1 });
        if (!incident) {
            return res.status(404).json({ error: "No active incident found for this monitor" });
        }
        res.json(incident);
    } catch (err) {
        next(err);
    }
};