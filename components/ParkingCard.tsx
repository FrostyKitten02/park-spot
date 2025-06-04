import Card from "@/components/Card";
import {Car, Parked} from "@/model/Models";
import {Pressable} from "react-native";
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
        <Pressable
            onPress={() => {
                if (props.parked.id == undefined) {
                    return;
                }
                router.push(`/AddParkedModal?parkedId=${props.parked.id}`)
            }}
        >
            <Card
                onPress={() => {}}
                marginVertical={props.marginVertical}
                title={props.parked?.car?.name??""}
                secondaryText={getDateTimeStr()}
            />
        </Pressable>
    )
}