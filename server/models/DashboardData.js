import mongoose from 'mongoose';

const dashboardSchema = new mongoose.Schema({
  userStats: {
    attendance: { type: Number, required: true },
    testsCompleted: { type: Number, required: true },
    hoursLearned: { type: Number, required: true }
  },
  upcomingClasses: [{
    title: { type: String, required: true },
    teacher: { type: String, required: true },
    startsIn: { type: String, required: true }
  }],
  recentMaterials: [{
    title: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: String, required: true }
  }],
  gamification: {
    streak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: String, default: "Beginner" }
  },
  personalizedFocus: {
    weakSubject: { type: String },
    recommendationTitle: { type: String },
    recommendationType: { type: String }
  }
});

const DashboardData = mongoose.model('DashboardData', dashboardSchema);

export default DashboardData;
