import Card from "@/components/Card";
import {Car, Parked} from "@/model/Models";


export default function ParkingCard(props: {
    parked: Parked
    marginVertical: number
}) {

    function getDateTimeStr() {
        if (props.parked.start == undefined) {
            return "";
        }

        return props.parked.start.toLocaleString();
    }


    return (
        <Card
            onPress={() => {}}
            marginVertical={props.marginVertical}
            title={props.parked?.car?.name??""}
            secondaryText={getDateTimeStr()}
        />
    )
}