import { IUseCase } from "../../contracts/iusecase";

// Definindo as Interfaces de Entrada e Saida
export interface IConsultarHorarioEntrada {
    matriculaId: string;
    cursoId: string;
}

export interface IHorarioAula {
    diaSemana: string;
    horarioInicio: string;
    horarioFim: string;
    disciplina: string;
    professor: string;
    sala: string;
}

export interface IConsultarHorarioSaida {
    horarios: IHorarioAula[];
    nomeAluno: string;
    nomeCurso: string;
    periodo: string;
}

// Classe principal que implementa o UseCase
export class ConsultarHorario implements IUseCase<IConsultarHorarioEntrada, IConsultarHorarioSaida> {

    // Simular uma base de dados de matriculas
    private matricula = [
        {
            matriculaId: '1',
            cursoId: '1',
            nomeAluno: 'Joaquim',
            nomeCurso: 'Analise e Desenvolvimento de Sistemas',
            periodo: '2024.1',
        },
    ];

    // Simular uma base de dados de cursos
    private cursos = [
        { 
            cursoId: '1', 
            nome: 'Analise e Desenvolvimento de Sistemas', 
            periodo: '2024.1', 
            horarios: [
                {
                    diaSemana: 'Segunda',
                    horarioInicio: '10:00',
                    horarioFim: '11:00',
                    disciplina: 'Programação',
                    professor: 'João Silva',
                    sala: 'Sala 101'
                }
            ] 
        },
    ];

    async perform(entrada: IConsultarHorarioEntrada): Promise<IConsultarHorarioSaida> {

        // Verificar se a matricula existe
        const matricula = this.matricula.find(m => m.matriculaId === entrada.matriculaId);
        if(!matricula) {
            throw new Error('Matricula não encontrada');
        }

        // Verificar se o curso existe
        const curso = this.cursos.find(c => c.cursoId === entrada.cursoId);
        if(!curso) {
            throw new Error('Curso não encontrado');
        }

        // Lógica para consultar o horário do aluno
        return {
            horarios: curso?.horarios || [],
            nomeAluno: matricula?.nomeAluno || '',
            nomeCurso: curso?.nome || '',
            periodo: curso?.periodo || '',
        };
    }
}