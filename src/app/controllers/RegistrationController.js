import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = await Registration.findAll({
      order: [['created_at', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
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
    return res.status(501).json({ todo: 'Implement show method in RegistrationController' });
  }

  async store(req, res) {
    return res.status(501).json({ todo: 'Implement store method in RegistrationController' });
  }

  async update(req, res) {
    return res.status(501).json({ todo: 'Implement update method in RegistrationController' });
  }

  async delete(req, res) {
    return res.status(501).json({ todo: 'Implement delete method in RegistrationController' });
  }
}

export default new RegistrationController();
