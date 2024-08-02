# AppConfig

## Create and Deploy Scripts

`$ ./create_application.sh`

```text
>>>>> aws appconfig create-application --name adgu
{
    "Id": "yfhb93i",
    "Name": "adgu"
}
```

`$ ./create_environment.sh`

```text
Usage: ./create_environment.sh <app-id>
```

`$ ./create_environment.sh yfhb93i`

```text
>>>>> aws appconfig create-environment --application-id yfhb93i --name Prod
{
    "ApplicationId": "yfhb93i",
    "Id": "n3s81l4",
    "Name": "Prod",
    "State": "ReadyForDeployment"
}
```

`$ ./create_configuration_profile.sh yfhb93i`

```text
>>>>> aws appconfig create-configuration-profile --location-uri hosted --application-id yfhb93i --name adgu-prod-config
{
    "ApplicationId": "yfhb93i",
    "Id": "2cewxzj",
    "Name": "adgu-prod-config",
    "LocationUri": "hosted",
    "Type": "AWS.Freeform"
}
```

`$ ./create_hosted_configuration_version-1.sh yfhb93i 2cewxzj`

```text
aws appconfig create-hosted-configuration-version --application-id yfhb93i --configuration-profile-id 2cewxzj --content {"number":1} --content-type application/json outputfile
{
    "ApplicationId": "yfhb93i",
    "ConfigurationProfileId": "2cewxzj",
    "VersionNumber": 1,
    "ContentType": "application/json"
}
>>>>> contents of outputfile:
{"number":1}
```

```text
$ ./start_deployment.sh
>>>>> aws appconfig list-applications
{
    "Items": [
        {
            "Id": "yfhb93i",
            "Name": "adgu"
        }
    ]
}
Which app id?:
yfhb93i
>>>>> aws appconfig list-environments --application-id yfhb93i
{
    "Items": [
        {
            "ApplicationId": "yfhb93i",
            "Id": "n3s81l4",
            "Name": "Prod",
            "State": "ReadyForDeployment"
        }
    ]
}
Which env id?:
n3s81l4
>>>>> aws appconfig list-configuration-profiles --application-id yfhb93i
{
    "Items": [
        {
            "ApplicationId": "yfhb93i",
            "Id": "2cewxzj",
            "Name": "adgu-prod-config",
            "LocationUri": "hosted",
            "Type": "AWS.Freeform"
        }
    ]
}
Which profile id?:
2cewxzj
>>>>> aws appconfig list-hosted-configuration-versions --configuration-profile-id 2cewxzj --application-id yfhb93i
{
    "Items": [
        {
            "ApplicationId": "yfhb93i",
            "ConfigurationProfileId": "2cewxzj",
            "VersionNumber": 1,
            "ContentType": "application/json"
        }
    ]
}
Which VersionNumber?:
1
>>>>> aws appconfig start-deployment --application-id yfhb93i --environment-id n3s81l4 --deployment-strategy-id AppConfig.AllAtOnce --configuration-profile-id 2cewxzj --configuration-version 1
{
    "ApplicationId": "yfhb93i",
    "EnvironmentId": "n3s81l4",
    "DeploymentStrategyId": "AppConfig.AllAtOnce",
    "ConfigurationProfileId": "2cewxzj",
    "DeploymentNumber": 1,
    "ConfigurationName": "adgu-prod-config",
    "ConfigurationLocationUri": "hosted",
    "ConfigurationVersion": "1",
    "DeploymentDurationInMinutes": 0,
    "GrowthType": "LINEAR",
    "GrowthFactor": 100.0,
    "FinalBakeTimeInMinutes": 10,
    "State": "DEPLOYING",
    "EventLog": [
        {
            "EventType": "DEPLOYMENT_STARTED",
            "TriggeredBy": "USER",
            "Description": "Deployment started",
            "OccurredAt": "2023-08-25T17:29:08.724Z"
        }
    ],
    "PercentageComplete": 0.0,
    "StartedAt": "2023-08-25T17:29:08.724Z",
    "AppliedExtensions": []
}
```

## Now configure poll_config.js and run in another terminal session

`$ node ./AppConfig/poll_config`
```text
InitialConfigurationToken:
AYADeHwE3rblHB7BLOBiFlcK28YAXwABABVhd3MtY3J5cHRvLXB1YmxpYy1rZXkAREF6d0xBWUwweEd2Yms0MnlydDdnSzhXdlRvMXc1T0dGaFJKSHF1OXpaRmNLYTNNdlhqQzA3aW5MYm1qbnkyNmpFdz09AAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMjoxNjAzNjc3OTczNjM6a2V5L2NlZmNhNzFhLWRmMGEtNGU2NC1iNjRlLWE2YzBkNGQxMDdiNQC4AQIBAHh+8F0UHzUQSET2RLnAMjrO4UhIPMEMX0qy1xBKFa0e9gFuMiO910lmRrgyLopzlZdJAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM1FsAoazjWZDLbRcbAgEQgDt/3tZHVDLfXa+3/cLXdaPs5POYPGm/JiPH9oUMm2rWNFxxqBbv6exmzGobIp44RJZFWSHs8OB7k004PgIAAAAADAAAEAAAAAAAAAAAAAAAAACUUD3/E7se+BYRkQVgAMr0/////wAAAAEAAAAAAAAAAAAAAAEAAAD85fGrsuraxN5NRpOPZGkJGirZmeosFJUHnIVrFpN9o9eRGdbhd+TxwVHUiPehUXDRcib+FfMkEZfampxSJn915Sgh0YvP83fBjIE7Q9LyY76A2TNzQh0E7bG+yz+BW2s76U9NioYvHFp5mySvnPl5x2CPjQYAnUKMnbcH+Et4jyaxZU2i54vD77L7GUBDI8cRvzP0pXlWDNYeQKIGus8ZGor+mF6RCKk57SHowdUh8ATj9t4VcaieIrBFeaIzhm8yOzAIOe7crh0/47e0G5lOp9FL0CdsCJfG6QJErD/SRgNXh3e995sBRzLJx/vm+jMDDHaMsSOg0ozx+887YXSmbGiZnfw8V5jLuUKiNQBnMGUCMQDxsbPD3ZQC/7BJzyeaskM3DTL25cGuRsvyj2yRn4+aE/rBW7jOuegNY3LRGRLNRsgCMBkUYAT4igAj6WPrKXhhvZNWHBs+B9iYJvKTaoGVpPM2p3mfJHxLKKO8U0qR2O/n1w==


New token:
AYADeHlrfbjYFYqYyZTEJU1IZQMAXwABABVhd3MtY3J5cHRvLXB1YmxpYy1rZXkAREF6d0xBWUwweEd2Yms0MnlydDdnSzhXdlRvMXc1T0dGaFJKSHF1OXpaRmNLYTNNdlhqQzA3aW5MYm1qbnkyNmpFdz09AAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMjoxNjAzNjc3OTczNjM6a2V5L2NlZmNhNzFhLWRmMGEtNGU2NC1iNjRlLWE2YzBkNGQxMDdiNQC4AQIBAHh+8F0UHzUQSET2RLnAMjrO4UhIPMEMX0qy1xBKFa0e9gFuMiO910lmRrgyLopzlZdJAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM1FsAoazjWZDLbRcbAgEQgDt/3tZHVDLfXa+3/cLXdaPs5POYPGm/JiPH9oUMm2rWNFxxqBbv6exmzGobIp44RJZFWSHs8OB7k004PgIAAAAADAAAEAAAAAAAAAAAAAAAAAAV1Ea+bCasBdTtm8ADAHgY/////wAAAAEAAAAAAAAAAAAAAAEAAAEZ6NZHuvin6RYdaq6+jrHdEI0mB7Je84surz0/v7vLqmV4MPjvgLkQyWnujtNkJ9i/0FWu2J/zGK7P1KRUeeXVNRL6q2gOYRf+BBkdc9KPhuP6/DSp+1Ye4QV5APRpPmKNXzIlQqzn+iK2/FUB9hCKlgWBHAzggbxLDVwDEsZu06VZKa0uUJL1Pq+UsuJVus6uc6Qd3aoEX9gYT8QjehZboqdl+AgN0TdOYvItJAQe7b2aci68bVBSjGx6OBSLx0hLypj5xP4XCMMeM5IBTiY0uE7zNZ/quZj//erVkM/Wb99kqC2GwgaQRNZFc33FgGTKrDo0Xm2shwGpKBWsRbJuHW3/Z7w89iB/yl+stZaCbttysB0CrEzABWJPsw5U5OB8+LOb3gKWizTeAGcwZQIwUvMLyP9SA9Bd2kZW1Y80zWndKJ5O8YtW8uynaqTlz1HS/sFtdXEX3t97fYBdTz/KAjEA/+C2QCLCfi13OPqH3LdgW4oiJfDjRH6xwoyMrzHHfYJUmheCUjudDwnexaoIzd36

sleep_dur:
60

Configuration:
b'{"number":1}'


Sleeping for 60 seconds
60
55
50
45
40
35
30
25
20
15
10
5
New token:
AYADeBLBrk7o1GBa2FEOqG+l5HYAXwABABVhd3MtY3J5cHRvLXB1YmxpYy1rZXkAREF6d0xBWUwweEd2Yms0MnlydDdnSzhXdlRvMXc1T0dGaFJKSHF1OXpaRmNLYTNNdlhqQzA3aW5MYm1qbnkyNmpFdz09AAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMjoxNjAzNjc3OTczNjM6a2V5L2NlZmNhNzFhLWRmMGEtNGU2NC1iNjRlLWE2YzBkNGQxMDdiNQC4AQIBAHh+8F0UHzUQSET2RLnAMjrO4UhIPMEMX0qy1xBKFa0e9gFuMiO910lmRrgyLopzlZdJAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM1FsAoazjWZDLbRcbAgEQgDt/3tZHVDLfXa+3/cLXdaPs5POYPGm/JiPH9oUMm2rWNFxxqBbv6exmzGobIp44RJZFWSHs8OB7k004PgIAAAAADAAAEAAAAAAAAAAAAAAAAADUv2BJiiOfEY9BGFGnqdkH/////wAAAAEAAAAAAAAAAAAAAAEAAAEZdUUu0DknNrCQiOICQF1kaoySn2YtgpMgn4LIzntYhAhniqk90a+lPt7nNprxJVcSPHxjt4aqYntDNaGnqFFLZS7sQq9tf2ROQGNX2x11SZsrtU9qes4VE2/LA9B/JNa3X01jiglGcC4GmAMaNViOCoHRBBuLkvE22VY8K8DldXylK3APeP+AXsokpHvXrzGXB6TdqEjEsvu5HuXtH0mt7XDtcih7PHFLfFZVGUPi9Wf+3eo9elRDcUyIl6Blml3w3aB/n4pjxSWd6zqfiivWOzPiR1AwvAc07toOn4MfAYWXBL10XMpIDs68goEOGza91j/ZVWdjn9ayg+VF2+5c3rFTDHDy50v07Qy5dcLOfm56Cxmb6SFBeTrJVAthCBfShB57OTR5lLDTAGcwZQIxAL1SxMJVZd91i5Ox8EovWpD/cWg796ytKIUEFCgc59+d6qHcF3nZ2DYBFceC/3XdkQIwaE+6Co6ErRg7FoakaxBI2H572zppDee4xShai9A5OXx1xhlMwrpfpqWGFMEcDxnB

sleep_dur:
60

Configuration:
b''


10 minutes later, after deploying version 2 of the configuration.

Sleeping for 60 seconds
60
55
50
45
40
35
30
25
20
15
10
5
New token:
AYADeFf2ZaflpwReV7/fZ6+F1YcAXwABABVhd3MtY3J5cHRvLXB1YmxpYy1rZXkAREFwNW96cFVhRzJIWWNmNHJRT090cmJKdTVqSjRobzZCT2tnZWhxYmxEUk5adDZHMFBGQlVPYzNzNEh6Nm42NVdGQT09AAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMjoxNjAzNjc3OTczNjM6a2V5L2NlZmNhNzFhLWRmMGEtNGU2NC1iNjRlLWE2YzBkNGQxMDdiNQC4AQIBAHh+8F0UHzUQSET2RLnAMjrO4UhIPMEMX0qy1xBKFa0e9gEW0+V4atjmhMaNojihH82lAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMgUXoLuLt7WErQpwSAgEQgDtbzzLFTEx/Qa/wgxTERLbG5hhL9R1cO5sbpbak+p9TGxuWkbxoAHNpZmgwNTXksWFPJdPNnIAcgIaU3gIAAAAADAAAEAAAAAAAAAAAAAAAAAA1gfYOxmtR/cVKrallWb8u/////wAAAAEAAAAAAAAAAAAAAAEAAAEZ9P+kdi+LLOdv9u2U0FqCWcCYAGMD9lFs78tsepLmSwW4O4l7o0FU1MyEm8lcQbdmzSBJYeR46MOMJvPKtIiOacJVKIBZIHY+kllDDgS0iZYDzG1flgEUs1xjShtK4W5/dVyObZqUga4zya99L/akVeOMdA/Lqh7FPHdBWX4xixIk7cM4kA8oy7Cls3cx9atajJNb7YFPgacSE8dhg2enGmSiU+fHBl/p6skUHB7r1LSVLuRLNm38VhgmWSRGJLPO3jtNsYlYn4Fo4HebW3AXezJPZQbphL03612TYWqEOxbEC7DsUk2P6WouzXav7JUcGyaBu1kIfc7z/74AUSu9bw2iDxAjwTKvixg6uIiJo8wb+I0TGu/fR2LJXtnfHgh7ySBX5UNRY8xYAGcwZQIxALw2Dt+tifP733WNbfFiQIIGWREHH57c91ybn1StBke9gtyYFYlg0W6/8Do4CB6Z3gIwXc+k2FNo00RrDrAIPOEz/zVmoM3WYQts60hsUQTL2sS2BbCAwT2ejqP5R4HG2mui

sleep_dur:
60

Configuration:
b'{"number":2}'


Sleeping for 60 seconds
60
```

```text
$ ./create_hosted_configuration_version-2.sh
Usage: ./7_create_hosted_configuration_version-2.sh <app_id> <configuration_profile_id>
[nick@nuc AppConfig]$ ./7_create_hosted_configuration_version-2.sh yfhb93i 2cewxzj
aws appconfig create-hosted-configuration-version --application-id yfhb93i --configuration-profile-id 2cewxzj --content {"number":2} --content-type application/json outputfile
{
    "ApplicationId": "yfhb93i",
    "ConfigurationProfileId": "2cewxzj",
    "VersionNumber": 2,
    "ContentType": "application/json"
}
>>>>> contents of outputfile:
{"number":2}
[nick@nuc AppConfig]$ ./8_start_deployment_v2.sh
>>>>> aws appconfig list-applications
{
    "Items": [
        {
            "Id": "yfhb93i",
            "Name": "adgu"
        }
    ]
}
Which app id?:
yfhb93i
>>>>> aws appconfig list-environments --application-id yfhb93i
{
    "Items": [
        {
            "ApplicationId": "yfhb93i",
            "Id": "n3s81l4",
            "Name": "Prod",
            "State": "Deploying"
        }
    ]
}
Which env id?:
n3s81l4
>>>>> aws appconfig list-configuration-profiles --application-id yfhb93i
{
    "Items": [
        {
            "ApplicationId": "yfhb93i",
            "Id": "2cewxzj",
            "Name": "adgu-prod-config",
            "LocationUri": "hosted",
            "Type": "AWS.Freeform"
        }
    ]
}
Which profile id?:
2cewxzj
>>>>> aws appconfig list-hosted-configuration-versions --configuration-profile-id 2cewxzj --application-id yfhb93i
{
    "Items": [
        {
            "ApplicationId": "yfhb93i",
            "ConfigurationProfileId": "2cewxzj",
            "VersionNumber": 2,
            "ContentType": "application/json"
        },
        {
            "ApplicationId": "yfhb93i",
            "ConfigurationProfileId": "2cewxzj",
            "VersionNumber": 1,
            "ContentType": "application/json"
        }
    ]
}
Which VersionNumber?:
2
>>>>> aws appconfig start-deployment --application-id yfhb93i --environment-id n3s81l4 --deployment-strategy-id AppConfig.AllAtOnce --configuration-profile-id 2cewxzj --configuration-version 2

An error occurred (ConflictException) when calling the StartDeployment operation: Environment n3s81l4 currently has a state of DEPLOYING. The current deployment must finish before a new deployment can be started.
[nick@nuc AppConfig]$ sleep 600
[nick@nuc AppConfig]$ ./8_start_deployment_v2.sh
>>>>> aws appconfig list-applications
{
    "Items": [
        {
            "Id": "yfhb93i",
            "Name": "adgu"
        }
    ]
}
Which app id?:
yfhb93i
>>>>> aws appconfig list-environments --application-id yfhb93i
{
    "Items": [
        {
            "ApplicationId": "yfhb93i",
            "Id": "n3s81l4",
            "Name": "Prod",
            "State": "ReadyForDeployment"
        }
    ]
}
Which env id?:
n3s81l4
>>>>> aws appconfig list-configuration-profiles --application-id yfhb93i
{
    "Items": [
        {
            "ApplicationId": "yfhb93i",
            "Id": "2cewxzj",
            "Name": "adgu-prod-config",
            "LocationUri": "hosted",
            "Type": "AWS.Freeform"
        }
    ]
}
Which profile id?:
2cewxzj
>>>>> aws appconfig list-hosted-configuration-versions --configuration-profile-id 2cewxzj --application-id yfhb93i
{
    "Items": [
        {
            "ApplicationId": "yfhb93i",
            "ConfigurationProfileId": "2cewxzj",
            "VersionNumber": 2,
            "ContentType": "application/json"
        },
        {
            "ApplicationId": "yfhb93i",
            "ConfigurationProfileId": "2cewxzj",
            "VersionNumber": 1,
            "ContentType": "application/json"
        }
    ]
}
Which VersionNumber?:
2
>>>>> aws appconfig start-deployment --application-id yfhb93i --environment-id n3s81l4 --deployment-strategy-id AppConfig.AllAtOnce --configuration-profile-id 2cewxzj --configuration-version 2
{
    "ApplicationId": "yfhb93i",
    "EnvironmentId": "n3s81l4",
    "DeploymentStrategyId": "AppConfig.AllAtOnce",
    "ConfigurationProfileId": "2cewxzj",
    "DeploymentNumber": 2,
    "ConfigurationName": "adgu-prod-config",
    "ConfigurationLocationUri": "hosted",
    "ConfigurationVersion": "2",
    "DeploymentDurationInMinutes": 0,
    "GrowthType": "LINEAR",
    "GrowthFactor": 100.0,
    "FinalBakeTimeInMinutes": 10,
    "State": "DEPLOYING",
    "EventLog": [
        {
            "EventType": "DEPLOYMENT_STARTED",
            "TriggeredBy": "USER",
            "Description": "Deployment started",
            "OccurredAt": "2023-08-25T17:44:15.178Z"
        }
    ],
    "PercentageComplete": 0.0,
    "StartedAt": "2023-08-25T17:44:15.178Z",
    "AppliedExtensions": []
}
```
