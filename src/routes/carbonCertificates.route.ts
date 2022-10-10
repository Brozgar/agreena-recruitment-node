import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import CarbonCertificatesController from "@controllers/carbonCertificates.controller";
import { TransferCarbonCertificateDto } from "@dtos/carbonCertificates.dto";
import authMiddleware from "@middlewares/auth.middleware";

class CarbonCertificatesRoute implements Routes {
  public path = '/carbon-certificates';
  public router = Router();
  public certificatesController = new CarbonCertificatesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.certificatesController.getAllAvailable);
    this.router.get(`${this.path}/my`, authMiddleware, this.certificatesController.getMyCertificates);
    this.router.post(`${this.path}/:id/transfer`, authMiddleware, validationMiddleware(TransferCarbonCertificateDto, 'body', true), this.certificatesController.transferOne);
  }
}

export default CarbonCertificatesRoute;
