import * as Yup from 'yup';
import { parseISO, addMonths } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = await Registration.findAll({
      order: [['created_at', 'DESC']],
      limit: process.env.PER_PAGE,
      offset: (page - 1) * process.env.PER_PAGE,
      attributes: ['id', 'start_date', 'end_date', 'price', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(registrations);
  }

  async show(req, res) {
    const { id } = req.params;
    const registration = await Registration.findByPk(id, {
      attributes: ['id', 'start_date', 'end_date', 'price', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    return res.json(registration);
  }

  async store(req, res) {
    // Validation.
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const { start_date, plan_id, student_id } = req.body;

    // Check if the plan exists.
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    // Check if the student exists.
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Calculate the end_date due choosen plan.
    const end_date = addMonths(parseISO(start_date), plan.duration);

    // Calculate the price due choosen plan.
    const price = plan.duration * plan.price;

    // Create a new plan.
    const registration = await Registration.create({
      start_date,
      end_date,
      price,
      student_id: student.id,
      plan_id: plan.id,
    });

    return res.status(201).json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    // Find the registration by id.
    const { id } = req.params;
    const registration = await Registration.findByPk(id, {
      attributes: ['id', 'start_date', 'end_date', 'price', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    const { start_date, plan_id, student_id } = req.body;

    // Check if the plan exists.
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    // Check if the student exists.
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Calculate the end_date due choosen plan.
    const end_date = addMonths(parseISO(start_date), plan.duration);

    // Calculate the price due choosen plan.
    const price = plan.duration * plan.price;

    // Update registration.
    const updatedRegistration = await registration.update({
      start_date,
      end_date,
      price,
      student_id: student.id,
      plan_id: plan.id,
    });

    return res.json(updatedRegistration);
  }

  async delete(req, res) {
    // Find registration by id.
    const { id } = req.params;
    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    // Delete registration.
    await registration.destroy();

    return res.status(204).json();
  }
}

export default new RegistrationController();
