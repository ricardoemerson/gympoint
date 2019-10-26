import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { student_id } = req.params;

    // Check if student exists.
    const student = await Student.findByPk(student_id, {
      attributes: ['id', 'name', 'email'],
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id },
      attributes: ['id', 'question', 'answer', 'answer_at', 'createdAt', 'updatedAt'],
      include: {
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'email'],
      },
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    // Validation.
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const { student_id } = req.params;

    // Check if student exists.
    const student = await Student.findByPk(student_id, {
      attributes: ['id', 'name', 'email'],
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Check if the question is already registered.
    const helpOrderExists = await HelpOrder.findOne({
      where: { student_id, question: req.body.question },
    });

    if (helpOrderExists) {
      return res.status(422).json({ error: 'You already made this question.' });
    }

    // Create a new help order.
    const helpOrder = await HelpOrder.create({
      ...req.body,
      student_id,
    });

    return res.status(201).json(helpOrder);
  }
}

export default new HelpOrderController();
