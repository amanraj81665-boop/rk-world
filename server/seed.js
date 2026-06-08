import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';

import Course from './models/Course.js';
import Doubt from './models/Doubt.js';
import MockTest from './models/MockTest.js';
import DashboardData from './models/DashboardData.js';
import LibraryMaterial from './models/LibraryMaterial.js';
import LeaderboardEntry from './models/LeaderboardEntry.js';
import UserProfile from './models/UserProfile.js';
import LiveClass from './models/LiveClass.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Course.deleteMany();
    await Doubt.deleteMany();
    await MockTest.deleteMany();
    await DashboardData.deleteMany();
    await LibraryMaterial.deleteMany();
    await LeaderboardEntry.deleteMany();
    await UserProfile.deleteMany();
    await LiveClass.deleteMany();
    console.log('Cleared existing data');

    // 1. Seed Dashboard Data
    await DashboardData.create({
      userStats: { attendance: 95, testsCompleted: 18, hoursLearned: 42 },
      upcomingClasses: [
        { title: 'Physics: Rotation', teacher: 'Rahul Sir', startsIn: '30m' },
        { title: 'Maths: Calculus', teacher: 'Amit Sir', startsIn: '3h' },
        { title: 'Chemistry: Kinetics', teacher: 'Neha Mam', startsIn: 'Tomorrow' }
      ],
      recentMaterials: [
        { title: 'Calculus Advanced Formulas', type: 'PDF', size: '2.4 MB' },
        { title: 'Organic Chemistry Reactions', type: 'PDF', size: '1.8 MB' },
        { title: 'Newtonian Mechanics 3D', type: 'Video', size: '45 MB' },
        { title: 'Modern Physics Mindmap', type: 'Image', size: '1.2 MB' }
      ],
      gamification: {
        streak: 12,
        xp: 3450,
        level: 'Gold Scholar'
      },
      personalizedFocus: {
        weakSubject: 'Organic Chemistry',
        recommendationTitle: 'Mastering Name Reactions (Mains & Advanced)',
        recommendationType: 'Video Lecture'
      }
    });

    // 2. Seed Courses
    await Course.create({
      title: 'Physics: Class 12th Batch (Lakshya)',
      module: 'Module 4: Thermodynamics',
      teacher: 'Rahul Sir',
      isActive: true,
      progress: 20,
      chapters: [
        { title: 'Introduction to Thermodynamics', duration: '45:20', completed: true, active: false },
        { title: 'Laws of Thermodynamics', duration: '52:10', completed: false, active: true },
        { title: 'Heat Engines & Refrigerators', duration: '48:15', completed: false, active: false },
        { title: 'Entropy & Second Law', duration: '55:00', completed: false, active: false },
        { title: 'Previous Year Questions (PYQ)', duration: '1:12:00', completed: false, active: false }
      ]
    });

    // 3. Seed Doubts
    await Doubt.insertMany([
      { subject: 'Physics', text: 'How to calculate tension in a string with two masses over a pulley?', likes: 142, isSolved: true },
      { subject: 'Maths', text: 'Is there a shortcut for Integration by parts?', likes: 98, isSolved: false },
      { subject: 'Chemistry', text: 'What is the major product in SN1 reaction of 2-bromobutane?', likes: 215, isSolved: true }
    ]);

    // 4. Seed Mock Test
    await MockTest.create({
      examName: 'JEE Main 2024 Mock Test #1',
      subjects: 'Physics, Chemistry, Mathematics',
      durationSeconds: 10800,
      totalQuestions: 90,
      marksPerCorrect: 4,
      marksPerIncorrect: -1,
      studentDetails: { name: 'Aman Raj', roll: '231450' }
    });

    const libraryData = [
      { title: 'Physics: Mechanics Master Notes', subject: 'Physics', type: 'PDF', size: '4.2 MB', downloads: 1205, rating: 4.8 },
      { title: 'Calculus Integration Tricks', subject: 'Maths', type: 'PDF', size: '2.1 MB', downloads: 340, rating: 4.9 },
      { title: 'Organic Chemistry Mindmaps', subject: 'Chemistry', type: 'Image', size: '5.5 MB', downloads: 890, rating: 4.7 },
      { title: 'Laws of Motion 3D Visualization', subject: 'Physics', type: 'Video', size: '120 MB', downloads: 550, rating: 4.6 },
      { title: 'JEE Main 2023 PYQs with Solutions', subject: 'All', type: 'PDF', size: '15 MB', downloads: 2100, rating: 4.9 },
      { title: 'Coordinate Geometry Formula Sheet', subject: 'Maths', type: 'PDF', size: '1.5 MB', downloads: 420, rating: 4.5 },
    ];
    await LibraryMaterial.insertMany(libraryData);

    const leaderboardData = [
      { rank: 1, name: 'Rahul Sharma', score: 98.5, trend: 'up' },
      { rank: 2, name: 'Aman Raj (You)', score: 95.2, trend: 'up', isCurrentUser: true },
      { rank: 3, name: 'Priya Singh', score: 94.8, trend: 'down' },
      { rank: 4, name: 'Vikram Gupta', score: 91.0, trend: 'same' },
      { rank: 5, name: 'Neha Verma', score: 89.5, trend: 'up' },
    ];
    await LeaderboardEntry.insertMany(leaderboardData);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Aman12345', salt);

    const userProfileData = {
      name: 'Raushan Sir (Admin)',
      email: 'admin@rkworld.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      targetExam: 'JEE Main & Advanced',
      userClass: 'Class 12th',
      isPro: true,
      rank: 2
    };
    await UserProfile.create(userProfileData);
    
    const studentData = {
      name: 'Test Student',
      email: 'student@rkworld.com',
      password: hashedPassword,
      role: 'student',
      phone: '+91 98765 43210',
      targetExam: 'NEET',
      userClass: 'Class 12th',
      isPro: false,
      rank: 15
    };
    await UserProfile.create(studentData);

    const personalData = {
      name: 'Raushan Sir',
      email: 'amanraj81665@gmail.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      targetExam: 'JEE Main & Advanced',
      userClass: 'Class 12th',
      isPro: true,
      rank: 1
    };
    await UserProfile.create(personalData);

    const liveClassData = {
      title: 'Advanced Mathematics: Calculus',
      subject: 'Mathematics',
      teacher: 'Aman Sir',
      viewers: 5430,
      isLive: true,
      chatMessages: [
        { id: 1, sender: 'Aman Sir', text: 'Welcome to the Mathematics Masterclass!', isTeacher: true }
      ]
    };
    await LiveClass.create(liveClassData);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
