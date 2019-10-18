import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll();

    return res.json(students);
  }

  async show(req, res) {
    // Find student by id.
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    return res.json(student);
  }

  async store(req, res) {
    // Validation.
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    // Check if the student is already registered.
    const studentExists = await Student.findOne({ where: { email: req.body.email } });
    console.log('studentExists: ', studentExists);

    if (studentExists) {
      return res.status(422).json({ error: 'Student already exists.' });
    }

    // Create a new student.
    const { id, name, email, age, weight, height } = await Student.create(req.body);

    return res.status(201).json({ id, name, email, age, weight, height });
  }

  async update(req, res) {
    // Validation.
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    // Find student by id.
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Update student.
    const { name, email, age, weight, height } = await student.update(req.body);

    return res.json({ id, name, email, age, weight, height });
  }
}

export default new StudentController();