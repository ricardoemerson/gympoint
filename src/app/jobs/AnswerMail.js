import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    await Mail.sendMail({
      to: `${ helpOrder.student.name } <${ helpOrder.student.email }>`,
      subject: 'Seu questionamento foi respondido',
      template: 'answer',
      context: {
        student: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answer_at: format(
          parseISO(helpOrder.answer_at),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          { locale: ptBR },
        ),
      },
    });
  }
}

export default new AnswerMail();
