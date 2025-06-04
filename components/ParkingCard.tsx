import Card from "@/components/Card";
import {Parked} from "@/model/Models";
import {useRouter} from "expo-router";


export default function ParkingCard(props: {
    parked: Parked
    marginVertical: number
}) {
    const router = useRouter()


    function getDateTimeStr() {
        if (props.parked.start == undefined) {
            return "";
        }

        return props.parked.start.toLocaleString();
    }


    return (
        <Card
            onPress={() => {
                if (props.parked.id == undefined) {
                    return;
                }
                router.push(`/AddParkedModal?parkedId=${props.parked.id}`)
            }}
            marginVertical={props.marginVertical}
            title={props.parked?.car?.name??"Parking"}
            secondaryText={getDateTimeStr()}
        />
    )
}