import Card from "@/components/Card";
import {Car} from "@/model/Models";
import {useRouter} from "expo-router";
import {Alert} from "react-native";
import {CarStorage} from "@/storage/CarStorage";
import {useSQLiteContext} from "expo-sqlite";


export default function CarCard(props: {
    car: Car
    marginVertical: number,
    onDelete: () => void
}) {
    const db = useSQLiteContext();
    const router = useRouter();

    return (
        <Card
            onPress={() => {

            }}
            onDoublePress={() => {
                router.push(`/AddCarModal?carId=${props.car.id}`)
            }}
            marginVertical={props.marginVertical}
            title={props.car.name??""}
            secondaryText={props.car.registrationPlateNumber??""}
            rightActionColor={"#FF3B30"}
            rightActionText={"Delete"}
            rightActionFn={() => {
                Alert.alert(
                    'Delete Car',
                    'Are you sure you want to delete this ' + (props.car.name??"") +' car?',
                    [
                        {
                            text: 'Cancel',
                        },
                        {
                            text: 'Delete',
                            onPress: async () => {
                                if (props.car.id == undefined) {
                                    return;
                                }
                                CarStorage.deleteCardById(db, props.car.id)
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