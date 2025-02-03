import { ControllerBasico } from "../../controllers/ConsultarHorarioController";
import { UseCaseBasico } from "../../domain/usecases/ConsultarHorario";

export function factoryControllerBasico() {
    const uc = new UseCaseBasico();
    const contr = new ControllerBasico(uc);
    return contr;
}