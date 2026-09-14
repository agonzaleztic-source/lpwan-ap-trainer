/* Comprobaciones de fin de lección en inglés, indexadas por id de lección y
   posición dentro de `checks`. Mismo criterio que questions.en.js: solo texto,
   opciones en el mismo orden que el español. */
export const CHECKS_EN = {
  phy1: [
    {
      q: "Why can LoRa demodulate signals below the noise floor?",
      opts: [
        "Because it transmits with more power",
        "Because correlation with the known chirp concentrates the signal energy but not the noise energy",
        "Because it uses very aggressive error correction",
        "Because the receiver filters in a narrow band",
      ],
      exp: "The processing gain comes from correlation: the spread energy of the chirp is concentrated into a peak, while random noise remains dispersed.",
    },
    {
      q: "An end-device moves from SF9 to SF11. What happens to the symbol duration?",
      opts: [
        "It is multiplied by four",
        "It doubles",
        "It is halved",
        "It does not change if the BW is the same",
      ],
      exp: "Each SF step doubles Tsym, so two steps multiply it by four. It also roughly quadruples the time on air and the energy per message.",
    },
    {
      q: "The Sync Word 0x34 is used to:",
      opts: [
        "Encrypt the header",
        "Synchronize Class B beacons",
        "Indicate the spreading factor",
        "Distinguish public LoRaWAN network traffic and discard the rest early",
      ],
      exp: "It is an efficiency filter sent in the clear. It provides no cryptographic protection whatsoever.",
    },
  ],
  phy2: [
    {
      q: "What is the effect of moving from 125 to 250 kHz while keeping SF7?",
      opts: [
        "It doubles the data rate and worsens sensitivity by about 3 dB",
        "It doubles the range",
        "Nothing relevant changes",
        "It enables LDRO",
      ],
      exp: "Doubling the BW halves Tsym, but lets in twice the noise power, which degrades sensitivity by approximately 3 dB.",
    },
    {
      q: "LDRO is enabled when:",
      opts: [
        "The coding rate is 4/8",
        "SF11 or SF12 is used with 125 kHz bandwidth",
        "The payload exceeds 51 bytes",
        "The end-device enters Class B",
      ],
      exp: "With symbols lasting tens of milliseconds, clock drift compromises demodulation. LDRO sacrifices two bits per symbol to gain margin, and appears as DE = 1 in the time-on-air formula.",
    },
    {
      q: "A distant end-device stops being received when a nearby one transmits at the same time with a different SF. This is due to:",
      opts: [
        "A Sync Word failure",
        "The capture effect: the strong signal masks the weak one despite quasi-orthogonality",
        "The duty-cycle limit",
        "The absence of a coding rate",
      ],
      exp: "Orthogonality between spreading factors is only approximate. Large differences in received power break the separation between demodulators.",
    },
  ],
  phy3: [
    {
      q: "In the time-on-air formula, what does PL represent?",
      opts: [
        "Only the application payload",
        "The transmit power",
        "The number of preamble symbols",
        "The complete PHYPayload, including headers and MIC",
      ],
      exp: "PL is the number of bytes of the physical frame. On top of the application payload you must add MHDR, FHDR, FPort and MIC: at least 13 bytes.",
    },
    {
      q: "With a time on air of 2 s and a 1% duty cycle, how long must you wait before transmitting again in that sub-band?",
      opts: [
        "20 s",
        "100 s",
        "198 s",
        "3,600 s",
      ],
      exp: "The wait is ToA · (100/dc − 1) = 2 · 99 = 198 s. That is, at most about 18 messages per hour.",
    },
    {
      q: "Why is downlink the scarcest resource in a LoRaWAN cell?",
      opts: [
        "Because end-devices cannot receive",
        "Because the gateway is half-duplex and subject to its own duty cycle",
        "Because the Network Server limits downlinks to one per hour",
        "Because downlink always uses SF12",
      ],
      exp: "While transmitting, the gateway does not receive, and its transmit time is limited by regulation. An excess of confirmed frames drains that budget quickly.",
    },
  ],
  arq1: [
    {
      q: "A gateway receives a frame from a device it has never seen before. What does it do?",
      opts: [
        "It forwards it to the Network Server with radio metadata",
        "It discards it because the device is not associated",
        "It asks the Join Server whether it accepts the device",
        "It decrypts it and sends it to the Application Server",
      ],
      exp: "There is no association between end-device and gateway. The gateway forwards any LoRaWAN frame it receives, and it is the Network Server that decides whether the session is valid.",
    },
    {
      q: "Who chooses the gateway that will transmit a downlink?",
      opts: [
        "The device, in the FCtrl field",
        "The gateway that received best",
        "The Network Server, based on SNR and availability",
        "The Application Server",
      ],
      exp: "The Network Server centralizes the decision: it knows about all duplicate receptions and the duty-cycle state of every gateway.",
    },
    {
      q: "Why does LoRaWAN not use a mesh topology?",
      opts: [
        "Because the radio would not allow it",
        "Because the specification left it for a future version",
        "Because relaying other devices' traffic would ruin end-device batteries and add routing complexity",
        "Because gateways already act as end-devices",
      ],
      exp: "The star-of-stars keeps the end-device asleep almost all the time. Gateway diversity provides the reliability that mesh provides in other technologies.",
    },
  ],
  arq2: [
    {
      q: "Which key prevents the network operator from reading your sensor's data?",
      opts: [
        "NwkSKey",
        "The Sync Word",
        "NwkKey",
        "AppSKey",
      ],
      exp: "The application FRMPayload is encrypted with the AppSKey, which is known only to the device and the Application Server.",
    },
    {
      q: "The Join Server can belong to an organization other than the network operator because:",
      opts: [
        "European regulation requires it",
        "It needs direct access to the gateways",
        "Its role is to hold root keys and derive sessions, independent of radio management",
        "It only works with ABP",
      ],
      exp: "That separation makes it possible to change operator without reprogramming the devices, since the root keys stay in the same Join Server.",
    },
    {
      q: "Backend Interfaces (TS002) defines:",
      opts: [
        "The over-the-air frame format",
        "The messaging between NS, JS, AS and between operators in roaming",
        "The gateway packet forwarder protocol",
        "The regional frequency plans",
      ],
      exp: "It is the specification of the interfaces between servers. The gateway-to-server link is not covered by it.",
    },
  ],
  arq3: [
    {
      q: "Which identifier changes in every OTAA join procedure?",
      opts: [
        "DevEUI",
        "JoinEUI",
        "DevAddr",
        "NetID",
      ],
      exp: "The DevAddr identifies a session, not the hardware, and the server assigns a new one in every Join-Accept along with fresh session keys.",
    },
    {
      q: "In passive roaming, MAC control of the session is kept by:",
      opts: [
        "The home Network Server",
        "The visited Network Server",
        "The Join Server",
        "The visited gateway",
      ],
      exp: "The visited fNS only forwards frames. In handover roaming, by contrast, the visited sNS takes over MAC management.",
    },
    {
      q: "Why is the DevAddr not enough to securely identify a frame?",
      opts: [
        "Because it is encrypted",
        "Because it is only used in ABP",
        "Because it changes in every frame",
        "Because it is only unique within a network and may be repeated across operators",
      ],
      exp: "It is 32 bits with a network prefix. The server always validates the MIC, which is what really proves authenticity.",
    },
  ],
  cls1: [
    {
      q: "A Class A end-device receives a downlink in RX1. What does it do next?",
      opts: [
        "It opens RX2 anyway in case there is more data",
        "It switches to Class C temporarily",
        "It retransmits the uplink",
        "It does not open RX2 and turns the radio off",
      ],
      exp: "Receiving in RX1 cancels RX2. If the server has more data queued, it signals it with the FPending bit so the end-device sends another uplink.",
    },
    {
      q: "In EU868, which frequency and data rate does RX2 use by default?",
      opts: [
        "The uplink's frequency and the same DR",
        "923.3 MHz and DR8",
        "868.1 MHz and DR5",
        "869.525 MHz and DR0",
      ],
      exp: "RX2 uses fixed parameters, in a sub-band with 10% duty cycle and the most robust data rate, to maximize the probability of delivery.",
    },
    {
      q: "Why is JOIN_ACCEPT_DELAY1 5 s rather than 1 s?",
      opts: [
        "Because the Join-Accept is longer",
        "Because the end-device transmits at SF12 during the join",
        "Because the server needs time to query the Join Server and derive keys",
        "Because regulation requires it",
      ],
      exp: "The join procedure involves a query to the Join Server and key derivation, which need more margin than the response to a data uplink.",
    },
  ],
  cls2: [
    {
      q: "How often is the beacon transmitted in Class B?",
      opts: [
        "30 s",
        "64 s",
        "128 s",
        "256 s",
      ],
      exp: "The beacon period is 128 s and is divided into a reserved window, the beacon window and a guard time.",
    },
    {
      q: "With a ping slot periodicity of k = 5, how many slots does the end-device open per period?",
      opts: [
        "4",
        "8",
        "32",
        "128",
      ],
      exp: "2^(7−5) = 4 slots every 128 s, that is, one downlink opportunity approximately every 32 seconds.",
    },
    {
      q: "A Class B end-device has gone three hours without receiving beacons. What state is it in?",
      opts: [
        "Still in Class B with widened windows",
        "It has disconnected and must repeat the join",
        "It has switched to Class C",
        "It has reverted to Class A",
      ],
      exp: "Beaconless mode widens the windows for about two hours. Once that margin is exhausted, the device leaves Class B and operates as Class A.",
    },
  ],
  cls3: [
    {
      q: "A Class C device has just transmitted an uplink. What happens next?",
      opts: [
        "It opens RXC immediately and does not open RX1",
        "It waits for the next uplink",
        "It only opens RX2",
        "It opens RX1 at its scheduled time and then returns to continuous RXC",
      ],
      exp: "Class C keeps RX1. It closes RXC during transmission and during RX1, and reopens it as soon as RX1 ends.",
    },
    {
      q: "During a FUOTA campaign, a battery-powered sensor usually:",
      opts: [
        "Stays in Class A throughout the process",
        "Repeats the join in Class C",
        "Switches temporarily to Class B or C and returns to A when finished",
        "Disables ADR permanently",
      ],
      exp: "The temporary class switch allows the fragments to be received in multicast without sacrificing battery life the rest of the time.",
    },
    {
      q: "Which class requires gateways with a precise time reference?",
      opts: [
        "Class A",
        "All of them equally",
        "Class C",
        "Class B",
      ],
      exp: "Class B beacons must be transmitted simultaneously and precisely, which requires GPS synchronization in the gateways.",
    },
  ],
  sec1: [
    {
      q: "What exactly does a Join-Request contain?",
      opts: [
        "DevAddr, FCnt and MIC",
        "JoinEUI, DevEUI and DevNonce, plus the MIC",
        "Encrypted AppKey and DevEUI",
        "NetID, DevAddr and CFList",
      ],
      exp: "18 bytes of payload: JoinEUI (8) + DevEUI (8) + DevNonce (2). It is sent in the clear but integrity-protected by the root key.",
    },
    {
      q: "How long is the payload of a Join-Accept that includes a CFList?",
      opts: [
        "12 bytes",
        "18 bytes",
        "28 bytes",
        "33 bytes",
      ],
      exp: "12 bytes of mandatory fields plus 16 of CFList. The list conveys additional channels or a channel mask depending on the region.",
    },
    {
      q: "A device whose non-volatile memory has been erased cannot join. The most likely cause is:",
      opts: [
        "It has lost the AppKey",
        "It is out of coverage",
        "Its DevNonce has been reset and the server rejects it as a repeat",
        "The JoinEUI has expired",
      ],
      exp: "Since 1.0.3 the DevNonce is a monotonic counter. The server rejects values already used, so its record on the server must be reset too.",
    },
  ],
  sec2: [
    {
      q: "What is the main operational risk of ABP?",
      opts: [
        "It does not support application encryption",
        "It requires a dedicated Join Server",
        "It does not allow Class A",
        "Losing the frame counters on reset breaks the session or forces the anti-replay protection to be disabled",
      ],
      exp: "The counters must persist in non-volatile memory. Disabling their validation on the server opens the door to replay attacks.",
    },
    {
      q: "If the keys of an ABP device are compromised, the solution is:",
      opts: [
        "Force a new join",
        "Physically reprogram the device with new keys",
        "Change the DevAddr on the server",
        "Rotate the Sync Word",
      ],
      exp: "ABP has no session renewal mechanism. Without a join procedure, the only way out is to re-provision the hardware.",
    },
    {
      q: "A freshly activated ABP device in EU868 initially knows:",
      opts: [
        "All the network's channels, received in the Join-Accept",
        "Only the three default channels, until it receives MAC commands",
        "The channels it scans itself",
        "None, until the first downlink",
      ],
      exp: "Without a Join-Accept there is no CFList, so it starts with the minimum regional configuration and relies on NewChannelReq to extend it.",
    },
  ],
  sec3: [
    {
      q: "The MIC of a LoRaWAN frame is:",
      opts: [
        "A 2-byte CRC",
        "A hash of the encrypted payload",
        "8 bytes with HMAC-SHA256",
        "4 bytes obtained with AES-128 CMAC",
      ],
      exp: "It is computed with AES-128 in CMAC mode over the complete frame and truncated to the first four bytes.",
    },
    {
      q: "Why does the ciphertext have the same length as the plaintext?",
      opts: [
        "Because the excess is discarded",
        "Because CTR mode combines the payload with a keystream via XOR, without padding",
        "Because the payload is always a multiple of 16",
        "Because it is compressed before encryption",
      ],
      exp: "Counter mode turns AES into a stream cipher. It is a valuable property when the maximum payload is 51 bytes.",
    },
    {
      q: "In LoRaWAN 1.1, why is the uplink MIC split between two keys?",
      opts: [
        "So that in roaming a visited network can verify its part without having full cryptographic control",
        "To speed up the computation",
        "To allow 8-byte MICs",
        "To separate Class A from Class B",
      ],
      exp: "FNwkSIntKey and SNwkSIntKey split the verification between the NS that forwards and the NS that serves the session, which is the basis of handover roaming.",
    },
  ],
  mac1: [
    {
      q: "Which field determines whether a frame is a Confirmed Data Up?",
      opts: [
        "FCtrl",
        "The MIC",
        "FPort",
        "The MType inside the MHDR",
      ],
      exp: "The MType occupies the three most significant bits of the MHDR. 100 corresponds to Confirmed Data Up.",
    },
    {
      q: "Over the air, a DevAddr 26011BDA appears as:",
      opts: [
        "26011BDA",
        "0126DA1B",
        "1BDA2601",
        "DA1B0126",
      ],
      exp: "Multi-byte fields are sent little-endian, so the bytes are reversed with respect to the usual representation.",
    },
    {
      q: "How many bytes of overhead does LoRaWAN add to an application payload in the simplest case?",
      opts: [
        "5",
        "9",
        "13",
        "18",
      ],
      exp: "MHDR (1) + FHDR (7) + FPort (1) + MIC (4) = 13 bytes, not counting FOpts.",
    },
  ],
  mac2: [
    {
      q: "The FPending bit in a downlink indicates that:",
      opts: [
        "The end-device must acknowledge the frame",
        "The server has more downlinks queued and another uplink should be sent",
        "The frame contains MAC commands",
        "The end-device is in Class B",
      ],
      exp: "It exists only in downlink. It tells the end-device that by opening new windows it will collect the rest of the pending data.",
    },
    {
      q: "Why are only 16 bits of the 32-bit counter transmitted?",
      opts: [
        "To save time on air; the receiver reconstructs the upper part",
        "Because more would not fit in the MIC",
        "Because the counter resets every 65,536 frames",
        "Because the upper part goes in the FPort",
      ],
      exp: "Both ends keep the full 32 bits and the receiver infers the rollover. The complete counter is used in the MIC and in the encryption.",
    },
    {
      q: "An end-device sends three confirmed frames in a row and receives a single ACK. What does it know?",
      opts: [
        "That all three arrived",
        "That only the last one arrived",
        "That at least one arrived, without being able to tell which",
        "That none arrived",
      ],
      exp: "The ACK neither numbers nor accumulates: it confirms reception without identifying the sequence, which limits its usefulness as a reliability mechanism.",
    },
  ],
  mac3: [
    {
      q: "A frame with FPort = 0 can contain:",
      opts: [
        "MAC commands and application data at the same time",
        "Only application data",
        "Only MAC commands encrypted with the network key",
        "The Join-Request",
      ],
      exp: "FPort 0 dedicates the entire FRMPayload to MAC commands. The two transport paths, FOpts and FPort 0, are mutually exclusive.",
    },
    {
      q: "What is the maximum length of the FOpts field?",
      opts: [
        "8 bytes",
        "15 bytes",
        "16 bytes",
        "51 bytes",
      ],
      exp: "FOptsLen occupies 4 bits of the FCtrl, hence the maximum of 15 bytes. If they do not fit, the commands must go in FPort 0.",
    },
    {
      q: "Port 224 is reserved for:",
      opts: [
        "Multicast traffic",
        "Clock synchronization",
        "Long MAC commands",
        "The certification test protocol",
      ],
      exp: "It is used by the test bench during LoRaWAN Certified certification. Ports 225 to 255 are reserved for future extensions.",
    },
  ],
  cmd1: [
    {
      q: "Who decides the new data rate when ADR is active?",
      opts: [
        "The Network Server, via LinkADRReq",
        "The device, based on its own SNR",
        "The gateway with the best reception",
        "The Join Server",
      ],
      exp: "The end-device only decides whether to participate by setting the ADR bit. The actual values are imposed by the server based on the SNR history.",
    },
    {
      q: "An end-device has sent 96 uplinks without receiving any downlink. What is it doing?",
      opts: [
        "It has already set ADRACKReq and started the backoff by raising power",
        "Nothing special, this is normal",
        "It has reverted to Class A",
        "It has repeated the join",
      ],
      exp: "ADR_ACK_LIMIT (64) plus ADR_ACK_DELAY (32) add up to 96. Past that threshold the end-device raises power to maximum and then starts lowering the data rate.",
    },
    {
      q: "Why is ADR discouraged on mobile devices?",
      opts: [
        "Because it consumes more battery",
        "Because the algorithm assumes stable radio conditions and reacts too late to movement",
        "Because it is not compatible with Class A",
        "Because the server rejects it",
      ],
      exp: "ADR optimizes over a recent history. An end-device optimized near the gateway loses its link as it moves away, and the backoff takes tens of uplinks to act.",
    },
  ],
  cmd2: [
    {
      q: "Which command lets the device find out how many gateways are hearing it?",
      opts: [
        "DevStatusReq",
        "LinkCheckReq",
        "LinkADRReq",
        "DeviceTimeReq",
      ],
      exp: "LinkCheckAns (0x02) returns the demodulation margin in dB and the number of gateways that received the frame.",
    },
    {
      q: "In DevStatusAns, a battery value of 0 means:",
      opts: [
        "Battery depleted",
        "It cannot be measured",
        "The device is externally powered",
        "Battery at 100%",
      ],
      exp: "0 indicates external power, 1 to 254 is the proportional scale and 255 means the device cannot measure the battery.",
    },
    {
      q: "A device accepts the proposed data rate but rejects the channel mask of a LinkADRReq. What happens?",
      opts: [
        "It applies only the data rate",
        "It applies none of the three parameters",
        "The server retries automatically",
        "The device reverts to the default channels",
      ],
      exp: "LinkADRAns acknowledges each field separately, but if any is rejected the device applies none of them: the command is treated as a whole.",
    },
  ],
  cmd3: [
    {
      q: "An ABP device stops being accepted after a power outage. The most likely cause is:",
      opts: [
        "It has lost its keys",
        "Its FCntUp has been reset and the server discards it as a repeat",
        "The gateway has changed",
        "The DevAddr has expired",
      ],
      exp: "The counters must persist in non-volatile memory. After a reset, the server interprets the frames as replays.",
    },
    {
      q: "Uplinks arrive fine but no downlink reaches the end-device. What would you check first?",
      opts: [
        "The application keys",
        "The uplink frequency plan",
        "The RX timing and the RX2 parameters",
        "The DevEUI",
      ],
      exp: "If the uplink works, the radio and the session are fine. The problem is usually in RxDelay or in a non-standard RX2 that the end-device does not know about.",
    },
    {
      q: "A battery-powered sensor drains its battery in months instead of years. The most likely cause is:",
      opts: [
        "Payload too short",
        "It operates at SF12 with confirmed frames or joins repeatedly",
        "It uses port 224",
        "It has the ADR bit set",
      ],
      exp: "Consumption is dominated by radio-active time. High SF, acknowledgements with retries and repeated joins are the three usual suspects.",
    },
  ],
  reg1: [
    {
      q: "Which document defines the frequency plans per region?",
      opts: [
        "TS001 Link Layer",
        "TS005 Remote Multicast Setup",
        "TS002 Backend Interfaces",
        "RP002 Regional Parameters",
      ],
      exp: "TS001 defines the protocol, which is universal. RP002 collects everything that depends on geography.",
    },
    {
      q: "In North America there is no duty-cycle limit, but there is:",
      opts: [
        "A maximum number of daily messages",
        "A downlink prohibition",
        "A 400 ms dwell time and mandatory frequency hopping",
        "A restriction to Class A",
      ],
      exp: "The FCC limits the duration of each transmission and requires channel rotation, which in practice rules out SF12 on 125 kHz channels.",
    },
    {
      q: "An ABP device in EU868 will only learn additional channels if:",
      opts: [
        "It receives them in the Join-Accept",
        "It scans them automatically",
        "The server sends them with NewChannelReq",
        "It changes regional plan",
      ],
      exp: "Without a join procedure there is no CFList, so the only way is the MAC command during the session.",
    },
  ],
  reg2: [
    {
      q: "What is the maximum application payload at DR2 in EU868?",
      opts: [
        "11 bytes",
        "115 bytes",
        "51 bytes",
        "242 bytes",
      ],
      exp: "DR0, DR1 and DR2 share a maximum of 51 bytes. From DR3 it rises to 115 and from DR4 to 242.",
    },
    {
      q: "The 869.4 to 869.65 MHz sub-band allows:",
      opts: [
        "25 mW and 1% duty cycle",
        "Uplink only",
        "100 mW without restriction",
        "500 mW and 10% duty cycle",
      ],
      exp: "It is the most generous sub-band of the plan, which is why it hosts the RX2 frequency, 869.525 MHz.",
    },
    {
      q: "In EU868, which data rate corresponds to SF9?",
      opts: [
        "DR2",
        "DR4",
        "DR3",
        "DR6",
      ],
      exp: "DR0 is SF12 and it goes down from there: DR3 corresponds to SF9. The DR number and the SF add up to 17 in the DR0 to DR5 range.",
    },
  ],
  reg3: [
    {
      q: "How many 125 kHz uplink channels does US915 define?",
      opts: [
        "8",
        "16",
        "64",
        "72",
      ],
      exp: "64 channels of 125 kHz starting at 902.3 MHz, plus 8 of 500 kHz. 72 uplink channels in total.",
    },
    {
      q: "A US915 device takes a very long time to join the network. The most likely cause is:",
      opts: [
        "It is at SF12",
        "It tries all 72 channels while the gateway only listens to one sub-band of 8",
        "Dwell time blocks the join",
        "It is missing the CFList",
      ],
      exp: "This is the classic US915 problem. Setting the correct sub-band on the device solves most of these cases.",
    },
    {
      q: "Which regional plan requires listening to the channel before transmitting (LBT)?",
      opts: [
        "EU868",
        "US915",
        "KR920",
        "IN865",
      ],
      exp: "KR920 (Korea) requires Listen Before Talk: the device checks that the channel is free before transmitting, unlike the duty cycle of EU868 or the dwell time of US915.",
    },
  ],
  ops1: [
    {
      q: "Which provides more link margin: going from SF7 to SF12, or doubling the antenna gain?",
      opts: [
        "The antenna, always",
        "Both equally",
        "The SF change: it provides about 14 dB",
        "Neither affects the margin",
      ],
      exp: "The 14 dB from the spreading factor change are hard to match with antennas, although they are paid for with 32 times more time on air.",
    },
    {
      q: "Why is raising the antenna usually preferred over increasing its gain?",
      opts: [
        "Because it is cheaper",
        "Because it reduces power consumption",
        "Because it clears the Fresnel zone and extends the horizon, whereas gain only redistributes energy",
        "Because regulation limits the gain",
      ],
      exp: "A high-gain antenna narrows the vertical lobe and can leave end-devices located right below the mast without coverage.",
    },
    {
      q: "A link calculation gives a margin of 2 dB. What do you conclude?",
      opts: [
        "The link is solid",
        "The calculation is wrong",
        "The spreading factor must be lowered",
        "It is insufficient: 10 to 20 dB must be reserved for environmental variability",
      ],
      exp: "Real propagation varies with rain, vegetation and device position. Without a fade margin, the link will fail intermittently.",
    },
  ],
  ops2: [
    {
      q: "Why do end-devices at SF12 penalize cell capacity so much?",
      opts: [
        "Because they use more channels",
        "Because they force a sub-band change",
        "Because they require additional downlinks",
        "Because they occupy the air about 24 times longer than SF7 ones for the same message",
      ],
      exp: "This is the far-end-device effect. A small percentage of slow devices can consume most of the available channel time.",
    },
    {
      q: "A cell is saturated. Which measure tackles the cause most directly?",
      opts: [
        "Increase NbTrans to compensate for losses",
        "Review ADR and reduce confirmed frames",
        "Move all end-devices to SF12 to be safe",
        "Enable Class C",
      ],
      exp: "Raising NbTrans or the spreading factor makes congestion worse. ADR and removing unnecessary acknowledgements free up channel time.",
    },
    {
      q: "Medium access in LoRaWAN is described as:",
      opts: [
        "TDMA coordinated by the gateway",
        "ALOHA: random transmission without listening to the channel",
        "CSMA with carrier sensing",
        "Token ring",
      ],
      exp: "This is what allows the end-device to sleep almost all the time, and also what makes the collision probability grow quadratically with load.",
    },
  ],
  ops3: [
    {
      q: "Which component dominates the power consumption of a well-designed LoRaWAN sensor?",
      opts: [
        "The microcontroller in sleep",
        "The non-volatile memory",
        "Reading the sensor",
        "Radio-active time, especially transmission",
      ],
      exp: "That is why reducing time on air through ADR and compact payloads is the measure with the greatest impact on battery life.",
    },
    {
      q: "During a FUOTA campaign, the redundancy of the fragmented transport serves to:",
      opts: [
        "Encrypt the firmware",
        "Speed up the download",
        "Allow the file to be reconstructed even if fragments are lost",
        "Verify the manufacturer's signature",
      ],
      exp: "Without redundancy, a single lost fragment would force the whole campaign to be repeated, which is unfeasible with thousands of devices.",
    },
    {
      q: "A device with LoRaWAN Certified:",
      opts: [
        "Can be sold in any country with no further formalities",
        "Is guaranteed a minimum coverage",
        "Has demonstrated compliance with the protocol and the regional parameters, but also needs regulatory certification",
        "Is exempt from CE marking",
      ],
      exp: "They are two independent processes: one attests interoperability and the other the legality of emission under RED or FCC.",
    },
  ],
};
