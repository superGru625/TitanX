import IntenseHeader from "../Components/Game/Intense/IntenseHeader";
import IntenseMain from "../Components/Game/Intense/IntenseMain";
import IntenseFooter from "../Components/Game/Intense/IntenseFooter";
const Intense = () => {
    return (
        <div className="d-flex animation-fade-in bg-intenseBg">
            <IntenseHeader />
            <IntenseMain />
            <IntenseFooter />
        </div>
    );
};
export default Intense;
