import Card from "@/components/Card";
import {Parked} from "@/model/Models";
import {useRouter} from "expo-router";
import {Alert} from "react-native";
import {ParkedStorage} from "@/storage/ParkedStorage";
import {useSQLiteContext} from "expo-sqlite";


export default function ParkingCard(props: {
    parked: Parked
    marginVertical: number,
    onDelete: () => void,
}) {
    const db = useSQLiteContext();
    const router = useRouter();


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
            rightActionColor={"#FF3B30"}
            rightActionText={"Delete"}
            rightActionFn={() => {
                Alert.alert(
                    'Delete parking',
                    'Are you sure you want to delete this parking?',
                    [
                        {
                            text: 'Cancel',
                        },
                        {
                            text: 'Delete',
                            onPress: async () => {
                                if (props.parked.id == undefined) {
                                    return;
                                }
                                ParkedStorage.deleteParkedById(db, props.parked.id)
                                props.onDelete();
                            },
                            style: 'destructive',
                        }
                    ],
                    {
                        cancelable: true,
                    },
                );
            }}
        />
    )
}