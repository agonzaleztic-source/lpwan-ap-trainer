/* English lesson bodies, by lesson id. Spanish (src/data/lessons.js) is the source of truth; block structure must match it one to one. */
export const LESSON_BODIES_EN_1 = {
  phy1: [
    { t: "p", x: "Every radio technology faces the same problem: at the receiver, the wanted signal arrives mixed with thermal noise. If the signal power drops below the noise power, a conventional receiver cannot decide which bit was transmitted. That threshold sets the maximum range of most systems." },
    { t: "p", x: "LoRa sidesteps that limit with a technique called Chirp Spread Spectrum. Instead of encoding information in the amplitude or phase of a fixed carrier, it transmits chirps: sweeps in which the frequency rises linearly from the bottom of the channel to the top. When it reaches the ceiling, it wraps around to the floor and keeps rising. The data is not in the instantaneous frequency, but in the point of the sweep at which the symbol starts." },
    { t: "h", x: "Where the gain comes from" },
    { t: "p", x: "The receiver knows exactly what the expected chirp looks like, so it multiplies the received signal by an identical down-chirp and applies a Fourier transform. The result concentrates all the energy of the symbol, which was spread over milliseconds and across the whole channel, into a single frequency peak. Noise, being random, does not concentrate: it stays spread out." },
    { t: "key", x: "That concentration is the processing gain. It makes it possible to demodulate signals that arrive 15 to 20 dB below the noise floor: quite literally, LoRa reads messages that a spectrum analyzer cannot tell apart from the background." },
    { t: "p", x: "The price is time. Spreading a symbol's energy over a longer period is what allows it to be recovered later, so robustness is always paid for in seconds of airtime and millijoules of battery. Almost every design decision in a LoRaWAN network is a variation of this same trade-off." },
    { t: "h", x: "Properties that follow from the chirp" },
    { t: "list", x: [
      "Immunity to the Doppler effect: a frequency shift moves the correlation peak, but barely destroys detection. That is why it works on moving objects and with cheap oscillators.",
      "Resistance to multipath: delayed replicas show up as separate peaks and do not add destructively as they do in narrowband modulations.",
      "Tolerance to narrowband interference: a fixed carrier inside the channel only corrupts a portion of the sweep.",
      "Quasi-orthogonality between spreading factors: signals with different SFs correlate poorly with each other, so a receiver can demodulate several at once on the same channel."
    ] },
    { t: "h", x: "What the spreading factor actually is" },
    { t: "p", x: "The SF defines how many bits each symbol carries and, therefore, how long it lasts. With SF7 there are 2⁷ = 128 possible starting positions within the sweep, so each symbol carries 7 bits. With SF12 there are 4,096 positions and each symbol carries 12 bits, but the full sweep lasts 32 times longer." },
    { t: "formula", x: "Tsym = 2^SF / BW", note: "SF12 at 125 kHz: 4096 / 125000 = 32.768 ms per symbol." },
    { t: "p", x: "From this comes the rule you need to have on autopilot: each one-step increase in SF doubles the symbol duration, halves the bit rate and buys roughly 2.5 dB of sensitivity." },
    { t: "warn", x: "SF is not transmit power. Raising the SF does not make the node shout louder; it makes it speak more slowly so that it can be understood. Confusing the two is a classic mistake in link budget questions." },
    { t: "h", x: "The Sync Word" },
    { t: "p", x: "Every LoRa frame carries a synchronization word that acts as an early filter: 0x34 identifies public LoRaWAN network traffic and 0x12 is commonly used in private networks. A receiver quickly discards packets whose Sync Word does not match, even if they share the same frequency and spreading factor. It is an efficiency mechanism, not a security one: it is sent in the clear and anyone can set it." }
  ],
  phy2: [
    { t: "p", x: "Three parameters determine how a LoRa link behaves. Understanding how they interact is what separates configuring a network from guessing." },
    { t: "h", x: "Bandwidth" },
    { t: "p", x: "LoRaWAN uses 125, 250 and 500 kHz. Doubling the bandwidth at the same SF halves the symbol duration: twice the data rate and half the time on air. But a channel twice as wide collects twice the noise power, so sensitivity worsens by about 3 dB." },
    { t: "key", x: "Bandwidth and spreading factor move sensitivity in opposite directions: +1 SF gives about +2.5 dB, while doubling BW costs about −3 dB. That is why SF7 at 250 kHz (DR6 in Europe) is faster but reaches less far than SF7 at 125 kHz." },
    { t: "h", x: "Coding rate" },
    { t: "p", x: "LoRa applies Hamming-type forward error correction. The coding rate expresses the ratio between useful bits and transmitted bits: 4/5 adds one parity bit for every four data bits, and 4/8 adds four. More redundancy means a greater ability to correct isolated bit errors, and also a longer payload on the air." },
    { t: "table", head: ["CR", "Redundancy", "Effect"], rows: [
      ["4/5", "25%", "Default value in LoRaWAN. Best general compromise."],
      ["4/6", "50%", "Somewhat more robust, ~10% more time on air."],
      ["4/7", "75%", "Occasional use on links with interference."],
      ["4/8", "100%", "Doubles the redundancy. Rarely worth it compared with raising the SF."]
    ] },
    { t: "p", x: "In practice, LoRaWAN fixes 4/5 for data traffic. If a link fails, raising the SF usually pays off more than raising the coding rate, because the SF attacks sensitivity while the CR only corrects residual errors." },
    { t: "h", x: "Low Data Rate Optimization" },
    { t: "p", x: "With SF11 and SF12 at 125 kHz, a symbol lasts between 16 and 33 milliseconds. In that time, the oscillator drift of a cheap node can shift the signal enough for the receiver to confuse adjacent positions of the sweep. LDRO solves the problem by discarding the two least significant bits of each symbol, which widens the tolerance margin at the cost of reducing the effective rate." },
    { t: "warn", x: "LDRO is mandatory at SF11 and SF12 with 125 kHz, and it appears in the time-on-air formula as DE = 1. Forgetting it produces noticeably low ToA figures at the slow data rates, which is exactly where getting it right matters most." },
    { t: "h", x: "Quasi-orthogonality and its limits" },
    { t: "p", x: "A multichannel gateway carries several demodulators in parallel and can receive frames with different SFs on the same channel at the same time. The separation is not perfect: if two signals arrive with different SFs but one is much stronger than the other, the weak one is lost. This is the capture effect, and it explains why a node close to the gateway can systematically drown out a distant one." },
    { t: "h", x: "Reference sensitivity" },
    { t: "table", head: ["SF", "BW", "Typical sensitivity", "Bit rate"], rows: [
      ["SF7", "125 kHz", "−123 dBm", "5,470 bit/s"],
      ["SF8", "125 kHz", "−126 dBm", "3,125 bit/s"],
      ["SF9", "125 kHz", "−129 dBm", "1,760 bit/s"],
      ["SF10", "125 kHz", "−132 dBm", "980 bit/s"],
      ["SF11", "125 kHz", "−134.5 dBm", "440 bit/s"],
      ["SF12", "125 kHz", "−137 dBm", "250 bit/s"]
    ] },
    { t: "p", x: "The 14 dB separating SF7 from SF12 is the margin that takes you from urban coverage of a few hundred meters to rural links of several kilometers. It costs 32 times more time on air for the same message." }
  ],
  phy3: [
    { t: "p", x: "If there is one quantity you must be able to calculate from memory in LoRaWAN, it is time on air. Battery consumption, the number of messages that regulation allows, cell capacity and collision probability all depend on it. Most network design mistakes come down to having ignored it." },
    { t: "h", x: "The formula" },
    { t: "p", x: "Time on air is the sum of the preamble and the payload, both measured in symbols and multiplied by the symbol duration." },
    { t: "formula", x: "Tsym = 2^SF / BW\nTpreamble = (n_pre + 4.25) · Tsym\nn_payload = 8 + max( ceil( (8·PL − 4·SF + 28 + 16·CRC − 20·IH) / (4·(SF − 2·DE)) ) · (CR + 4), 0 )\nToA = Tpreamble + n_payload · Tsym", note: "n_pre = 8 in LoRaWAN. CRC = 1 in uplink and 0 in downlink. IH = 0 with explicit header. DE = 1 if LDRO is active. CR ranges from 1 (4/5) to 4 (4/8)." },
    { t: "p", x: "The 4.25 symbols added to the preamble correspond to the inverted synchronization chirps that mark the start of the frame. The fixed 8 in the payload term are the header symbols." },
    { t: "h", x: "What counts as PL" },
    { t: "p", x: "PL is the entire PHYPayload, not the application payload. On top of the application bytes you must add the LoRaWAN headers:" },
    { t: "table", head: ["Field", "Bytes"], rows: [
      ["MHDR", "1"],
      ["FHDR (DevAddr, FCtrl, FCnt)", "7 without FOpts"],
      ["FPort", "1 if there is a payload"],
      ["FRMPayload", "the application payload"],
      ["MIC", "4"]
    ] },
    { t: "key", x: "An application message of N bytes travels as N + 13 bytes on the air, and more if there are MAC commands in FOpts. Those 13 bytes of overhead are huge when the payload is a 4-byte temperature reading: design compact payloads, but know that the floor never drops below 13." },
    { t: "h", x: "Orders of magnitude you should recognize" },
    { t: "table", head: ["Configuration", "12 B application", "51 B application"], rows: [
      ["SF7 / 125 kHz", "~62 ms", "~118 ms"],
      ["SF9 / 125 kHz", "~206 ms", "~390 ms"],
      ["SF10 / 125 kHz", "~412 ms", "~698 ms"],
      ["SF12 / 125 kHz", "~1,483 ms", "~2,466 ms"]
    ] },
    { t: "p", x: "Comparing the first and last rows explains almost everything you need to know about scaling: the same message occupies the channel 24 times longer at SF12 than at SF7." },
    { t: "h", x: "From time on air to duty cycle" },
    { t: "p", x: "In Europe, regulation limits spectrum occupancy per sub-band: 1% in the default 868 MHz bands. That percentage applies over each hour and per transmitter." },
    { t: "formula", x: "minimum wait = ToA · (100 / dc − 1)\nmessages per hour = 3600 · (dc / 100) / ToA", note: "With dc = 1% and ToA = 1.5 s: 148.5 s of wait and only 24 messages per hour." },
    { t: "warn", x: "The duty cycle limit also applies to the gateway, which is also half-duplex. That is the real reason downlink is the scarce resource of a LoRaWAN network, not uplink capacity." },
    { t: "h", x: "And to energy" },
    { t: "p", x: "The energy of a transmission is power times time. With a typical transmit current of about 40 mA at 14 dBm, a message at SF7 uses on the order of tens of microampere-hours, and the same message at SF12 uses more than twenty times that. When a manufacturer promises ten years of battery life, it is implicitly assuming a high data rate and few messages per day." },
    { t: "p", x: "The calculators tab of this app implements exactly this formula, including automatic LDRO activation. Use it to internalize the orders of magnitude before the exam, not to replace them." }
  ],
  arq1: [
    { t: "p", x: "A LoRaWAN network has five pieces. It is best to learn them by following the journey of a message, because the exam asks more about responsibilities than about definitions." },
    { t: "table", head: ["Element", "Responsibility"], rows: [
      ["End device", "Measures, builds the frame, encrypts it and transmits it over the radio."],
      ["Gateway", "Receives any LoRaWAN frame within range and forwards it with radio metadata."],
      ["Network Server", "Deduplicates, validates integrity, manages MAC and ADR, schedules downlinks."],
      ["Join Server", "Holds the root keys and derives the session keys during the join."],
      ["Application Server", "Decrypts the payload and delivers the data to the business application."]
    ] },
    { t: "h", x: "Step by step" },
    { t: "num", x: [
      "The node encrypts the FRMPayload with the AppSKey, computes the MIC with the network key and transmits on a channel and data rate it chooses itself, without listening first or asking permission.",
      "All gateways within range receive the frame. There is no association between node and gateway: any gateway that hears it forwards it.",
      "Each gateway adds metadata (RSSI, SNR, channel, timestamp, gateway identifier) and sends it to the Network Server over IP.",
      "The Network Server identifies the session by the DevAddr, verifies the MIC with the network key and discards duplicate copies, keeping the best reception.",
      "If the frame contains MAC commands, it processes them. If it contains application data, it forwards the encrypted FRMPayload to the Application Server.",
      "The Application Server decrypts with the AppSKey and delivers the data.",
      "If a response is needed, the Network Server picks the gateway with the best SNR and schedules the downlink so that it arrives exactly in RX1 or RX2."
    ] },
    { t: "h", x: "The gateway is dumber than it looks" },
    { t: "p", x: "This is the idea that comes up most often in the exam. The gateway decrypts nothing, keeps no per-device state, does not decide who joins the network and does not acknowledge anything to the node. It is a radio-to-IP bridge. All the intelligence lives in the Network Server." },
    { t: "key", x: "Several gateways receiving the same frame is not a problem to be solved; it is the basis of LoRaWAN reliability: reception diversity replaces the association and handover mechanisms of cellular networks." },
    { t: "warn", x: "Since there is no association, there is no handover between cells either. A moving node does not change gateway: other gateways simply hear it. That is why LoRaWAN tolerates mobility at the network layer while ADR does not get along well with it." },
    { t: "h", x: "Star of stars" },
    { t: "p", x: "The topology is described as a star of stars: nodes form a star around the gateways, and the gateways form another around the server. There is no mesh. A node never forwards another node's traffic, which avoids the energy cost and routing complexity that sink other low-power technologies." },
    { t: "p", x: "The controlled exception is the relay, which does forward frames from nodes with no direct range to the gateway. It is a single, explicit hop, intended for basements and shadowed locations, not a generalized mesh." }
  ],
  arq2: [
    { t: "p", x: "LoRaWAN deliberately separates network security from application security. Understanding that separation explains why an independent Join Server exists and why you can contract a network operator without handing over your data." },
    { t: "h", x: "Two layers, two keys" },
    { t: "table", head: ["Layer", "Key", "Protects", "Known by"], rows: [
      ["Network", "NwkSKey", "Frame integrity (MIC) and MAC commands", "Network Server"],
      ["Application", "AppSKey", "Confidentiality of the FRMPayload", "Application Server"]
    ] },
    { t: "p", x: "The Network Server can verify that a frame is authentic and has not been tampered with, and it can read and generate MAC commands, but it cannot decrypt the payload. The Application Server sees the data but takes no part in radio management. It is a clean separation of privileges." },
    { t: "key", x: "If the network operator does not hold the AppSKey, it cannot read your sensors' data even if the whole network belongs to it. This is the central architectural argument for running your own Join Server or Application Server." },
    { t: "h", x: "Why the Join Server is a separate entity" },
    { t: "p", x: "The Join Server holds the root keys burned into the device during manufacturing. During the join procedure it validates the Join-Request, derives the session keys and distributes them: the network key to the Network Server and the application key to the Application Server. It can belong to the device manufacturer, the solution owner or a third party." },
    { t: "p", x: "That independence enables something important in practice: a fleet of devices can change network operator without touching the hardware, because the Join Server remains the same and it is enough to redirect the join routing." },
    { t: "h", x: "Backend Interfaces" },
    { t: "p", x: "The TS002 specification defines how these servers talk to each other, using HTTP/JSON messaging. The messages worth recognizing are JoinReq and JoinAns between NS and JS, AppSKeyReq for the AS to obtain its key, and the PRStartReq and XmitDataReq family for roaming between operators. None of this touches the radio interface." },
    { t: "warn", x: "A common question confuses Backend Interfaces with the protocol between gateway and server. Gateway forwarding is not standardized by the LoRa Alliance in that specification: each manufacturer or network uses its own mechanism, such as the Semtech UDP packet forwarder or Basic Station." }
  ],
  arq3: [
    { t: "p", x: "LoRaWAN uses several identifiers that are easy to mix up. Each has a different scope and lifetime." },
    { t: "table", head: ["Identifier", "Size", "Scope", "When it changes"], rows: [
      ["DevEUI", "64 bits", "Globally unique per device", "Never. Burned in at the factory."],
      ["JoinEUI", "64 bits", "Identifies the Join Server", "Only if the device is reprovisioned."],
      ["DevAddr", "32 bits", "Unique within a network", "On every OTAA join."],
      ["NetID", "24 bits", "Identifies the operator", "Never. Assigned by the LoRa Alliance."]
    ] },
    { t: "h", x: "How the DevAddr is built" },
    { t: "p", x: "The DevAddr is not random: its most significant bits form a prefix derived from the operator's NetID, and the rest identifies the device within that network. That structure is what makes roaming possible: a server that receives a frame from an unknown device can deduce from the prefix which home network it belongs to and where to forward it." },
    { t: "key", x: "The DevEUI identifies the hardware forever. The DevAddr identifies a session and is renewed on every join. Confusing them is one of the most frequent mistakes when debugging a network." },
    { t: "warn", x: "The DevAddr is only unique within a network. Two devices from different operators can share it, which is why the Network Server always validates the MIC in addition to the address before accepting a frame." },
    { t: "h", x: "Passive roaming" },
    { t: "p", x: "In passive roaming, the visited network acts as a frame forwarder. Its Network Server plays the fNS (forwarding) role and simply passes uplinks to the home hNS, which retains the keys, the session and all MAC control. The device notices nothing and its session does not change." },
    { t: "h", x: "Handover roaming" },
    { t: "p", x: "In handover, the visited network takes on the sNS (serving) role: it handles the MAC commands, ADR and downlink scheduling for that session, while the hNS keeps the relationship with the Application Server. This is a deeper split of responsibilities that requires greater agreements and trust between operators." },
    { t: "p", x: "Roaming is also the reason LoRaWAN 1.1 split network integrity into two keys, FNwkSIntKey and SNwkSIntKey: each half of the uplink MIC can be verified by a different server, so that the visited network operates without receiving full cryptographic control." }
  ],
  cls1: [
    { t: "p", x: "Class A is mandatory on every LoRaWAN device and defines the base behavior. Its rule is simple and has enormous consequences: the node only listens right after it has transmitted." },
    { t: "h", x: "The sequence" },
    { t: "num", x: [
      "The node wakes up and transmits its uplink whenever it suits it, without listening to the channel first.",
      "It waits RECEIVE_DELAY1 from the end of the transmission and opens a first receive window, RX1.",
      "If in RX1 it detects the preamble of a downlink addressed to it, it receives it and does not open the second window.",
      "If RX1 stays empty, it waits until RECEIVE_DELAY2 and opens RX2.",
      "If RX2 is also empty, it turns off the radio until the next uplink."
    ] },
    { t: "table", head: ["Parameter", "Default value in EU868", "What it sets"], rows: [
      ["RECEIVE_DELAY1", "1 s", "Opening of RX1 after the end of the uplink"],
      ["RECEIVE_DELAY2", "2 s", "Opening of RX2, always RECEIVE_DELAY1 + 1 s"],
      ["JOIN_ACCEPT_DELAY1", "5 s", "First window after a Join-Request"],
      ["JOIN_ACCEPT_DELAY2", "6 s", "Second window after a Join-Request"]
    ] },
    { t: "warn", x: "RECEIVE_DELAY2 is not configured independently: it is always RECEIVE_DELAY1 plus one second. The RXTimingSetupReq command adjusts the first, and the second is derived from it. The join delays are fixed and different, because the server needs more time to query the Join Server." },
    { t: "h", x: "How the two windows differ" },
    { t: "p", x: "RX1 reuses the uplink frequency and computes its data rate by applying RX1DROffset to the uplink's data rate, which defaults to zero in Europe (same data rate). RX2 uses a fixed frequency and data rate, independent of the uplink: in EU868, 869.525 MHz with DR0." },
    { t: "p", x: "The design is logical. RX1 takes advantage of the fact that the channel already worked in that direction. RX2 is the safety net: a frequency in a sub-band with a 10% duty cycle and higher permitted power, and the most robust data rate available, to maximize the probability that the downlink gets through." },
    { t: "h", x: "Design consequences" },
    { t: "list", x: [
      "Downlink latency is unpredictable: if the node reports every hour, a command may take up to an hour to be delivered.",
      "A class A device cannot be woken up from the server. Any interactivity requires the node to speak first.",
      "The server has a one-second window to decide, queue and schedule the downlink on the right gateway with millisecond precision.",
      "Every downlink consumes gateway duty cycle, so interactivity is paid for in cell capacity."
    ] },
    { t: "key", x: "Class A is not an optional low-power mode: it is the model that makes ten years of battery life possible. Everything else in LoRaWAN, including classes B and C, is defined as a deviation from this contract." },
    { t: "p", x: "A detail that gets asked: if the server has more data queued after a downlink, it sets the FPending bit. On seeing it, the node knows it should send another uplink soon to open new windows and collect the rest." }
  ],
  cls2: [
    { t: "p", x: "Class B solves the main limitation of class A (the device cannot be reached when you want) without falling into the consumption of an always-on radio. The idea is that node and network share a common time reference and agree on exact listening moments." },
    { t: "h", x: "The beacon" },
    { t: "p", x: "Gateways transmit a beacon every 128 seconds, all at the same time, synchronized via GPS. The node locks onto it and from that moment knows precisely where it is in time. That 128 s period is divided into a window reserved for the beacon itself, the beacon window in which the ping slots fall, and a guard time that protects the edge." },
    { t: "h", x: "Ping slots" },
    { t: "p", x: "Within each beacon period the node opens short receive windows called ping slots. Their number depends on the negotiated periodicity:" },
    { t: "formula", x: "number of ping slots = 2^(7 − k),  with k from 0 to 7", note: "k = 0 gives 128 slots per period (one every second, minimum latency and highest consumption). k = 7 gives a single slot every 128 s." },
    { t: "p", x: "The exact position of the slots is not fixed: it is computed with an AES-based function from the DevAddr and the beacon identifier. This spreads them pseudo-randomly across devices, prevents everyone from listening and colliding at the same instant, and makes tracking by an external observer more difficult." },
    { t: "h", x: "How a node enters class B" },
    { t: "num", x: [
      "The node synchronizes its clock, normally with DeviceTimeReq, and locates the next beacon.",
      "It declares the ping slot periodicity it wants with PingSlotInfoReq.",
      "The server confirms and may adjust the frequency and data rate of the ping slots with PingSlotChannelReq.",
      "The node sets the ClassB bit in the FCtrl field of its uplinks to indicate that it is now operating in class B."
    ] },
    { t: "h", x: "Beacon loss" },
    { t: "p", x: "If the node stops receiving beacons (a gateway goes down, coverage degrades), it enters beaconless mode. It keeps opening its ping slots, but progressively widens them to absorb the drift of its oscillator. That margin cannot grow indefinitely: after about two hours without synchronization, the node leaves class B and goes back to behaving as class A, informing the server." },
    { t: "warn", x: "Class B requires gateways with an accurate time reference and clearly increases consumption compared with class A. In practice its adoption is limited: it is used when deterministic downlinks or reliable multicast are needed, typically in firmware update campaigns." },
    { t: "key", x: "Class A: the downlink depends on the node speaking. Class B: the downlink arrives at instants known in advance. Class C: the downlink arrives at any time. Consumption grows in that same order." }
  ],
  cls3: [
    { t: "p", x: "Class C is the simplest to describe: the device keeps a receive window permanently open with the RX2 parameters, which in this context is called RXC. It closes it in only two situations: while transmitting and during the RX1 window that follows each uplink." },
    { t: "h", x: "The actual sequence after an uplink" },
    { t: "p", x: "A class C node does not stop opening RX1. The full sequence is: it transmits, closes RXC, opens RX1 at the usual instant, and as soon as RX1 ends it reopens RXC continuously. This is a detail that is asked about frequently, because many people assume class C replaces RX1 rather than adding to it." },
    { t: "key", x: "Class C does not eliminate RX1: it keeps it and fills everything else with RXC. Practically zero downlink latency, in exchange for an always-on receiver." },
    { t: "h", x: "Energy cost" },
    { t: "p", x: "A LoRa receiver in continuous listening consumes on the order of 10 to 15 mA. That is several hundred milliampere-hours per day, incompatible with any reasonable battery. Class C is for powered devices: actuators, luminaires, meters with mains power available, controllers." },
    { t: "h", x: "Temporary class switching" },
    { t: "p", x: "A device can switch class for a specific period. The canonical case is a firmware update over the air: the node operates in class A 99% of the time and, when the server schedules a campaign, switches to class C or B during the distribution window to receive the fragments via multicast, and returns to A when finished." },
    { t: "p", x: "The switch is coordinated at the application layer, through the multicast setup packages, not with a dedicated MAC command. Class A always remains available as the base behavior." },
    { t: "warn", x: "Comparing classes by latency without mentioning energy cost is incomplete. In the exam, questions about class selection almost always hide a power supply constraint in the statement." },
    { t: "table", head: ["", "Class A", "Class B", "Class C"], rows: [
      ["Mandatory", "Yes", "No", "No"],
      ["Downlink latency", "Until the next uplink", "Bounded by the ping slot", "Almost immediate"],
      ["Consumption", "Minimal", "Intermediate", "High"],
      ["Requires synchronization", "No", "Yes, GPS beacon", "No"],
      ["Typical use", "Battery-powered sensors", "Multicast and FUOTA", "Powered actuators"]
    ] }
  ]
};
