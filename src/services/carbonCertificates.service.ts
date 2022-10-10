import { HttpException } from "@exceptions/HttpException";
import { isEmpty, isSomeEmpty } from "@utils/util";
import carbonCertificatesModel from "@models/carbonCertificates.model";
import { CarbonCertificate, CarbonCertificateStatus } from "@interfaces/carbonCertificates.interface";

class CarbonCertificatesService {
  public async findAllAvailable(): Promise<CarbonCertificate[]> {
    return carbonCertificatesModel.find({ status: CarbonCertificateStatus.available });
  }

  public async findByUserId(userId: string): Promise<CarbonCertificate[]> {
    if (isEmpty(userId)) throw new HttpException(400, "UserId is empty");

    return carbonCertificatesModel.find({ owner: userId });
  }

  public async transfer(certificateId: string, currentUserId: string, toUserId: string): Promise<CarbonCertificate> {
    if (isSomeEmpty([certificateId, currentUserId, toUserId])) throw new HttpException(400, "Missing parameters");

    // We also check the ownership here to obscure for security
    const certificate = await carbonCertificatesModel.findOne({ _id: certificateId, owner: currentUserId });
    if (isEmpty(certificate)) throw new HttpException(400, "Certificate not found");

    const selectFields = {
      country: 1,
      status: 1,
      owner: 1
    }
    const updateData = {
      owner: toUserId,
      status: CarbonCertificateStatus.transferred
    };
    const updatedCertificate: CarbonCertificate = await carbonCertificatesModel
      .findByIdAndUpdate(certificateId, updateData, {new: true})
      .select(selectFields);
    if (!updatedCertificate) throw new HttpException(409, "Couldn't transfer the certificate");

    return updatedCertificate;
  }
}

export default CarbonCertificatesService;
