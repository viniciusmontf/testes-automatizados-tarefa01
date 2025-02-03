import { ConsultarHorarioController } from '../../src/controllers/ConsultarHorarioController';
import { IUseCase } from '../../src/contracts/iusecase';
import { IConsultarHorarioEntrada, IConsultarHorarioSaida } from '../../src/domain/usecases/ConsultarHorario';
import { Request, Response } from 'express';

describe('ConsultarHorarioController', () => {
    let mockUseCase: jest.Mocked<IUseCase<IConsultarHorarioEntrada, IConsultarHorarioSaida>>;
    let controller: ConsultarHorarioController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockUseCase = {
            perform: jest.fn()
        } as jest.Mocked<IUseCase<IConsultarHorarioEntrada, IConsultarHorarioSaida>>;

        controller = new ConsultarHorarioController(mockUseCase);

        mockRequest = {
            params: {
                matriculaId: '1',
                cursoId: '1'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Validação de Input', () => {
        const testCases = [
            { 
                name: 'deve retornar erro quando matriculaId é vazio', 
                params: { matriculaId: '', cursoId: '1' },
                expectedError: 'MatriculaId e cursoId não podem ser vazios'
            },
            { 
                name: 'deve retornar erro quando cursoId é vazio', 
                params: { matriculaId: '1', cursoId: '' },
                expectedError: 'MatriculaId e cursoId não podem ser vazios'
            },
            { 
                name: 'deve retornar erro quando matriculaId não é numérico', 
                params: { matriculaId: 'abc', cursoId: '1' },
                expectedError: 'MatriculaId e cursoId devem ser numéricos'
            },
            { 
                name: 'deve retornar erro quando cursoId não é numérico', 
                params: { matriculaId: '1', cursoId: 'xyz' },
                expectedError: 'MatriculaId e cursoId devem ser numéricos'
            }
        ];

        testCases.forEach(({ name, params, expectedError }) => {
            it(name, async () => {
                // Modifica os parâmetros da requisição
                Object.assign(mockRequest.params!, params);

                // Testa o método handle que invoca a validação internamente
                await expect(
                    controller.handle(mockRequest as Request, mockResponse as Response)
                ).rejects.toThrow(expectedError);
            });
        });
    });

    describe('Interação com o Use Case', () => {
        const mockSaida: IConsultarHorarioSaida = {
            horarios: [],
            nomeAluno: 'Teste Aluno',
            nomeCurso: 'Teste Curso',
            periodo: '2024.1'
        };

        it('deve chamar o use case com os parâmetros corretos', async () => {
            (mockUseCase.perform as jest.Mock).mockResolvedValue(mockSaida);

            await controller.handle(
                mockRequest as Request, 
                mockResponse as Response
            );

            expect(mockUseCase.perform).toHaveBeenCalledWith({
                matriculaId: '1',
                cursoId: '1'
            });
        });

        it('deve retornar 200 status com a resposta correta em caso de sucesso no use case', async () => {
            (mockUseCase.perform as jest.Mock).mockResolvedValue(mockSaida);

            await controller.handle(
                mockRequest as Request, 
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockSaida);
        });

        it('deve retornar 400 status em caso de erro no use case', async () => {
            const testError = new Error('Teste de Erro');
            (mockUseCase.perform as jest.Mock).mockRejectedValue(testError);

            await controller.handle(
                mockRequest as Request, 
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Teste de Erro' });
        });
    });
});
