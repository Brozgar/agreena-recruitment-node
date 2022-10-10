import { NextFunction, Request, Response } from "express";
import CarbonCertificatesService from "@services/carbonCertificates.service";
import { CarbonCertificate } from "@interfaces/carbonCertificates.interface";
import { RequestWithUser } from "@interfaces/auth.interface";

class CarbonCertificatesController {
  public certificateService = new CarbonCertificatesService();

  public getAllAvailable = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allAvailable: CarbonCertificate[] = await this.certificateService.findAllAvailable();

      res.status(200).json({ data: allAvailable, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getMyCertificates = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.user._id.toString();
      const findOneUserData: CarbonCertificate[] = await this.certificateService.findByUserId(currentUserId);

      res.status(200).json({ data: findOneUserData, message: "findMy" });
    } catch (error) {
      next(error);
    }
  };

  public transferOne = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id: certificateId } = req.params;
      const { toUserId } = req.body;
      const currentUserId = req.user._id.toString();
      const updatedCertificateData: CarbonCertificate = await this.certificateService.transfer(certificateId, currentUserId, toUserId);

      res.status(200).json({ data: updatedCertificateData, message: "transferred" });
    } catch (error) {
      next(error);
    }
  };
}

export default CarbonCertificatesController;
