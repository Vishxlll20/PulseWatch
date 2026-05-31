import monitorModel from '../models/monitor.model.js';
import logModel from '../models/log.model.js';


export const getLogsForMonitor = async (req, res, next) => {
    try {
        const{monitorId} = req.params;
        
        // Verify monitor belongs to user
        const monitor = await monitorModel.findOne({ _id: monitorId, userId: req.user._id });
        if (!monitor) return res.status(404).json({ error: "Monitor not found or unauthorized" });

        const { page = 1, limit = 20 } = req.query;
        // 🔥 PERFORMANCE FIX: sort by 'createdAt' to use the DB index, and use .lean() for faster JSON parsing
        const logs = await logModel.find({ monitorId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();
        if (!logs) {
            next(new Error('Logs not found for this monitor'));
        }
        res.json(logs);
    } catch (err) {
        next(err);
    }
};

export const deleteLogsForMonitor = async (req, res, next) => {
    try {
        const { monitorId } = req.params;

        // Verify monitor belongs to user
        const monitor = await monitorModel.findOne({ _id: monitorId, userId: req.user._id });
        if (!monitor) return res.status(404).json({ error: "Monitor not found or unauthorized" });

        const result = await logModel.deleteMany({ monitorId });
        res.json({ message: `${result.deletedCount} logs deleted for monitor ${monitorId}` });
    } catch (err) {
        next(err);
    }
};






