import { ControllerBasico } from "../../controllers/controller-basico";
import { UseCaseBasico } from "../../domain/usecases/ConsultarHorario";

export function factoryControllerBasico() {
    const uc = new UseCaseBasico();
    const contr = new ControllerBasico(uc);
    return contr;
}