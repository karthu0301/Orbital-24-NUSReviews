import HallsInfo from "../../housing/HallsInfo";
import HousesInfo from "../../housing/HousesInfo";
import RCInfo from "../../housing/RCInfo";
import SRInfo from "../../housing/SRInfo";
import AddInfo from "../../housing/AddInfo";
import '../../housing/HousingInfo.css'


const HousingInformationPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 className="hinfo-subheading">Halls of Residences</h2>
      <HallsInfo />
      <h2 className="hinfo-subheading">Houses</h2>
      <HousesInfo />
      <h2 className="hinfo-subheading">Residential Colleges</h2>
      <RCInfo />
      <h2 className="hinfo-subheading">Student Residences</h2>
      <SRInfo />
      <h2 className="hinfo-subheading">Additional Information</h2>
      <AddInfo />
    </div>
  )
};

export default HousingInformationPage;
