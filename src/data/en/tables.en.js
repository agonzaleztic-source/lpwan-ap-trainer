/* Tablas de referencia rápida en inglés. Misma forma que src/data/tables.js. */
export const T_DR_EU = [
  ["DR0", "SF12", "125 kHz", "250 bit/s", "51 B"],
  ["DR1", "SF11", "125 kHz", "440 bit/s", "51 B"],
  ["DR2", "SF10", "125 kHz", "980 bit/s", "51 B"],
  ["DR3", "SF9", "125 kHz", "1,760 bit/s", "115 B"],
  ["DR4", "SF8", "125 kHz", "3,125 bit/s", "242 B"],
  ["DR5", "SF7", "125 kHz", "5,470 bit/s", "242 B"],
  ["DR6", "SF7", "250 kHz", "11,000 bit/s", "242 B"],
  ["DR7", "FSK", "—", "50,000 bit/s", "242 B"],
];

export const T_MTYPE = [
  ["000", "Join-Request", "Uplink"],
  ["001", "Join-Accept", "Downlink"],
  ["010", "Unconfirmed Data Up", "Uplink"],
  ["011", "Unconfirmed Data Down", "Downlink"],
  ["100", "Confirmed Data Up", "Uplink"],
  ["101", "Confirmed Data Down", "Downlink"],
  ["110", "Rejoin-Request (1.1)", "Uplink"],
  ["111", "Proprietary", "—"],
];

export const T_CID = [
  ["0x02", "LinkCheck", "End-device", "Link margin and number of gateways"],
  ["0x03", "LinkADR", "Network Server", "DR, power, channel mask, NbTrans"],
  ["0x04", "DutyCycle", "Network Server", "Aggregated duty-cycle limit"],
  ["0x05", "RXParamSetup", "Network Server", "RX1DROffset and RX2 parameters"],
  ["0x06", "DevStatus", "Network Server", "End-device battery and SNR margin"],
  ["0x07", "NewChannel", "Network Server", "Add or remove an uplink channel"],
  ["0x08", "RXTimingSetup", "Network Server", "RX1 delay"],
  ["0x09", "TxParamSetup", "Network Server", "Maximum EIRP and dwell time"],
  ["0x0A", "DlChannel", "Network Server", "Downlink frequency of a channel"],
  ["0x0B", "Rekey (1.1)", "End-device", "Key-change confirmation"],
  ["0x0C", "ADRParamSetup (1.1)", "Network Server", "ADR_ACK_LIMIT and ADR_ACK_DELAY"],
  ["0x0D", "DeviceTime", "End-device", "GPS-referenced network time"],
  ["0x0E", "ForceRejoin (1.1)", "Network Server", "Forces a Rejoin-Request"],
  ["0x0F", "RejoinParamSetup (1.1)", "Network Server", "Rejoin periodicity"],
  ["0x10", "PingSlotInfo", "End-device", "Ping slot periodicity (Class B)"],
  ["0x11", "PingSlotChannel", "Network Server", "Ping slot frequency and DR"],
  ["0x13", "BeaconFreq", "Network Server", "Beacon frequency"],
];

export const T_KEYS = [
  ["AppKey", "1.0.x and 1.1", "Root", "Derives the session keys (1.0.x) or only the AppSKey (1.1)"],
  ["NwkKey", "1.1", "Root", "Derives the three network session keys"],
  ["NwkSKey", "1.0.x", "Session", "Frame MIC and MAC command encryption"],
  ["AppSKey", "1.0.x and 1.1", "Session", "Encrypts the application FRMPayload"],
  ["FNwkSIntKey", "1.1", "Session", "Half of the uplink MIC (forwarding NS)"],
  ["SNwkSIntKey", "1.1", "Session", "Half of the uplink MIC and the downlink MIC"],
  ["NwkSEncKey", "1.1", "Session", "Encrypts MAC commands"],
];

export const T_TIMES = [
  ["RECEIVE_DELAY1", "1 s", "RX1 opens after the end of the uplink"],
  ["RECEIVE_DELAY2", "2 s", "RX2 opens (always DELAY1 + 1 s)"],
  ["JOIN_ACCEPT_DELAY1", "5 s", "First window after the Join-Request"],
  ["JOIN_ACCEPT_DELAY2", "6 s", "Second window after the Join-Request"],
  ["ADR_ACK_LIMIT", "64", "Uplinks without a downlink before setting ADRACKReq"],
  ["ADR_ACK_DELAY", "32", "Additional uplinks before starting the backoff"],
  ["ACK_TIMEOUT", "2 ± 1 s", "Wait before retrying a downlink in Class B or C"],
  ["Beacon period", "128 s", "Interval between Class B beacons"],
];

export const T_DOCS = [
  ["TS001", "LoRaWAN Link Layer Specification", "Protocol, frames, MAC commands and classes"],
  ["TS002", "LoRaWAN Backend Interfaces", "Messaging between NS, JS, AS and roaming"],
  ["RP002", "Regional Parameters", "Frequency plans, data rates and limits per region"],
  ["TS003", "Application Layer Clock Synchronization", "Clock synchronization over the application layer"],
  ["TS004", "Fragmented Data Block Transport", "Fragmented transport, the basis of FUOTA"],
  ["TS005", "Remote Multicast Setup", "Multicast group configuration"],
  ["TS006", "Firmware Management Protocol", "Firmware update management"],
];
