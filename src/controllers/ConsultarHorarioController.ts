import { Request, Response } from 'express';
import { IUseCase } from '../contracts/iusecase';
import { IConsultarHorarioEntrada, IConsultarHorarioSaida } from '../domain/usecases/ConsultarHorario';

export interface IController {
    handle(req: Request, resp: Response): Promise<void>;
}

export class ConsultarHorarioController implements IController {
    private useCase: IUseCase<IConsultarHorarioEntrada, IConsultarHorarioSaida>;
    
    constructor(useCase: IUseCase<IConsultarHorarioEntrada, IConsultarHorarioSaida>){
        console.log("ConsultarHorarioController iniciado");
        this.useCase = useCase;
    }

    async handle(req: Request, resp: Response): Promise<void> {
        try {
            const entrada: IConsultarHorarioEntrada = {
                matriculaId: req.params.matriculaId,
                cursoId: req.params.cursoId,
            };

            this.validarEntrada(entrada);

            const saida = await this.useCase.perform(entrada);
            resp.status(200).json(saida);
            console.log("ConsultarHorarioController finalizado");
        } catch (error) {
            console.error("Erro ao consultar horário:", error);
            resp.status(400).json({ message: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    }

    private validarEntrada(entrada: IConsultarHorarioEntrada): void {
        if (!entrada.matriculaId || !entrada.cursoId) {
            throw new Error('MatriculaId e cursoId são obrigatórios');
        }

        const matriculaId = entrada.matriculaId.trim();
        const cursoId = entrada.cursoId.trim();

        if (matriculaId === '' || cursoId === '') {
            throw new Error('MatriculaId e cursoId não podem ser vazios');
        }

        if (!/^\d+$/.test(matriculaId) || !/^\d+$/.test(cursoId)) {
            throw new Error('MatriculaId e cursoId devem ser numéricos');
        }
    }
}