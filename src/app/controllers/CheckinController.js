import { Op } from 'sequelize';
import { startOfWeek, endOfWeek } from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;

    // Check if student exists.
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id },
      include: {
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'email'],
      },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { student_id } = req.params;

    // Check if student exists.
    const student = await Student.findByPk(student_id, {
      attributes: ['id', 'name', 'email'],
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Validate the Checkins Count.
    const checkinsCount = await Checkin.count({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfWeek(new Date()), endOfWeek(new Date())],
        },
      },
    });

    if (checkinsCount === 5) {
      return res.status(403).json({ error: 'Você já possui 5 checkins na semana corrente.' });
    }

    // Create a new checkin.
    const checkin = await Checkin.create({
      student_id,
    });

    return res.status(201).json(checkin);
  }
}

export default new CheckinController();
