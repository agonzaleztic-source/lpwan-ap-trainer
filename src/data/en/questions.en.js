/* Banco de tests en inglés, indexado por el `id` de src/data/questions.js.

   Solo texto: enunciado, opciones y explicación. El índice de la respuesta
   correcta (`a`), el dominio y la referencia a la especificación viven en el
   original español y no se repiten aquí. Las opciones van en el MISMO orden
   que en español, por eso `a` sigue valiendo; shuffleOptions() baraja después.

   Terminología: la de las especificaciones de la LoRa Alliance en inglés
   (TS001, RP002, TS002). El test translations.test.js exige que cada id del
   banco tenga aquí su traducción con cuatro opciones. */
export const QUESTIONS_EN = {
  1: { q: "Which modulation technique does LoRa use at the physical layer?", opts: ["Narrowband FSK", "64-carrier OFDM", "DSSS with Gold codes", "Chirp Spread Spectrum (CSS)"], exp: "LoRa uses Chirp Spread Spectrum: the carrier sweeps linearly across a frequency range (chirp). It gives high immunity to noise and to the Doppler effect, and allows demodulation below the noise floor. LoRaWAN also supports GFSK on some data rates (DR7 in EU868)." },
  2: { q: "If the spreading factor goes from SF7 to SF8 while keeping the bandwidth, what happens to the symbol duration?", opts: ["It is halved", "It does not change", "It doubles", "It is multiplied by four"], exp: "Tsym = 2^SF / BW. Each SF increment doubles the symbol duration, so it roughly doubles the time on air and halves the bit rate, in exchange for about 2.5 dB more sensitivity." },
  3: { q: "What is the symbol duration with SF12 and BW = 125 kHz?", opts: ["8.192 ms", "4.096 ms", "1.024 ms", "32.768 ms"], exp: "Tsym = 2^12 / 125000 = 4096 / 125000 = 32.768 ms. It is the longest symbol in classic LoRaWAN and the reason SF12 has times on air of several seconds." },
  4: { q: "Why is Low Data Rate Optimization (LDRO) enabled at SF11 and SF12 with BW 125 kHz?", opts: ["To increase the transmit power", "To compensate for clock drift during very long symbols", "To reduce PA power consumption", "To allow the use of CR 4/8"], exp: "With symbols lasting tens of milliseconds, oscillator drift can misalign demodulation. LDRO removes 2 bits per symbol (DE=1 in the ToA formula) to provide margin, at the cost of a lower effective rate." },
  5: { q: "Two nodes transmit at the same time on the same frequency with SF7 and SF10. What is most likely?", opts: ["They collide and both packets are lost", "The gateway switches to the higher SF and discards the rest", "Only the SF7 one is always received", "The gateway can demodulate both thanks to the quasi-orthogonality of the SFs"], exp: "Spreading factors are quasi-orthogonal: a multichannel gateway with parallel demodulators can simultaneously receive signals with different SFs on the same channel, as long as the difference in received power does not exceed the co-channel rejection margin." },
  6: { q: "What does Coding Rate 4/5 represent in LoRa?", opts: ["One redundancy bit for every 4 useful bits", "Four out of every five packets carry a CRC", "The ratio between BW and SF", "The permitted duty cycle ratio"], exp: "The CR indicates the Hamming-type forward error correction (FEC): 4/5 adds 1 parity bit for every 4 data bits; 4/8 adds 4. More redundancy improves robustness but lengthens the time on air." },
  7: { q: "Approximate order of receiver sensitivity for SF12/BW125 in a typical transceiver:", opts: ["−98 dBm", "−110 dBm", "−123 dBm", "−137 dBm"], exp: "SF7/125 kHz is around −123 dBm and SF12/125 kHz reaches about −137 dBm. That extra margin of ~14 dB is the processing gain that gives LoRa its kilometre-scale range." },
  8: { q: "In the time-on-air formula, how many symbols does the standard LoRaWAN preamble contribute?", opts: ["Exactly 8 symbols", "12.25 symbols", "8 + 4.25 symbols", "6 symbols"], exp: "LoRaWAN sets n_preamble = 8, and the formula adds 4.25 symbols corresponding to the inverted synchronization chirps: Tpreamble = (8 + 4.25) · Tsym." },
  9: { q: "What effect does doubling the bandwidth from 125 to 250 kHz have while keeping the SF?", opts: ["It doubles the range", "It doubles the bit rate and reduces sensitivity by ~3 dB", "It does not affect sensitivity", "It halves power consumption"], exp: "When BW is doubled, Tsym is halved: twice the rate and half the time on air, but twice the noise power enters, which degrades sensitivity by about 3 dB." },
  10: { q: "LR-FHSS is introduced in LoRaWAN mainly to:", opts: ["Improve capacity in very dense networks and direct-to-satellite links", "Increase the maximum payload", "Replace GFSK on downlink", "Enable Class B without a beacon"], exp: "LR-FHSS (Long Range Frequency Hopping Spread Spectrum) is used on uplink, appears at high data rates in the Regional Parameters and improves robustness and capacity in dense deployments, in addition to enabling reception by LEO satellites." },
  11: { q: "What is the impact of a higher SF on the node's energy consumption per message?", opts: ["It reduces it, because it transmits with less power", "It increases it, because the transmitter is active much longer", "It has no influence", "It depends only on the coding rate"], exp: "Energy per message is power × time. Going from SF7 to SF12 can multiply the time on air by more than 30, so ADR lowering the SF is the main lever for battery life." },
  12: { q: "The Sync Word field in LoRa is used to:", opts: ["Separate networks that share frequency and SF", "Encrypt the physical header", "Synchronize the beacon clock", "Indicate the coding rate"], exp: "The Sync Word (0x34 for public LoRaWAN networks, typically 0x12 for private ones) makes a receiver discard packets from another network early even if frequency and SF match. It provides no security." },
  13: { q: "The topology of a LoRaWAN network is described as:", opts: ["Star of stars", "Mesh with routing between nodes", "Redundant ring", "Hierarchical tree with repeaters"], exp: "Devices talk to all gateways within range (star) and the gateways connect to the Network Server (second star). There is no mesh: nodes do not forward other nodes' traffic, which preserves battery." },
  14: { q: "What role does the gateway play in LoRaWAN?", opts: ["It decrypts the application payload before forwarding it", "It decides which devices may join the network", "It acts as a transparent bridge that forwards frames with radio metadata", "It generates the session keys"], exp: "The gateway is a stateless bridge: it decrypts nothing and is not associated with specific devices. It adds metadata (RSSI, SNR, timestamp, channel) and delivers the frame to the Network Server, which decides and deduplicates." },
  15: { q: "Who removes the duplicates when several gateways receive the same uplink?", opts: ["The Join Server", "The gateway itself, using CAD", "The Application Server", "The Network Server"], exp: "Deduplication is a function of the Network Server, which also chooses the gateway with the best SNR/RSSI to send the corresponding downlink." },
  16: { q: "The main responsibility of the Join Server is:", opts: ["Storing the root key and processing the join request, deriving the session keys", "Routing the payload to the end customer", "Scheduling the receive windows", "Assigning radio channels"], exp: "The Join Server holds NwkKey/AppKey (or AppKey in 1.0.x), validates the Join-Request MIC, generates the Join-Accept and delivers the network key to the NS and the AppSKey to the AS. It can be an entity separate from the network operator." },
  17: { q: "What distinguishes passive roaming from handover roaming?", opts: ["Passive roaming only works in Class C", "In passive roaming the serving NS only forwards frames and MAC control stays with the home NS", "Handover roaming does not require a commercial agreement", "Passive roaming changes the device's DevAddr"], exp: "In passive roaming, the visited fNS acts as a mere forwarder and the hNS keeps the session and MAC control. In handover roaming, the visited sNS takes over MAC management of the session, with a deeper split of functions." },
  18: { q: "The NetID is used to:", opts: ["Identify the network and route traffic between operators", "Uniquely identify the device", "Encrypt the Join-Accept", "Number the frames"], exp: "The NetID is assigned by the LoRa Alliance to each operator; its least significant bits form the NwkID prefix of the DevAddr, which lets a visited NS know which home network to forward the frame to." },
  19: { q: "Which protocol does the LoRaWAN Backend Interfaces specification describe?", opts: ["The radio interface between node and gateway", "The messaging between NS, JS and AS (and between operators)", "The application payload format", "Beacon synchronization"], exp: "Backend Interfaces (TS002) defines HTTP/JSON messages such as JoinReq, AppSKeyReq, PRStartReq or XmitDataReq between the servers. It does not touch the radio interface." },
  20: { q: "In a LoRaWAN network, the security of the application payload against the network operator is achieved because:", opts: ["The NS does not have the AppSKey", "The gateway encrypts the traffic with TLS", "The AS forwards over a VPN", "The DevAddr is rotated on every frame"], exp: "LoRaWAN applies end-to-end security at two levels: the NwkSKey protects integrity towards the NS and the AppSKey encrypts the FRMPayload towards the AS. If the AppSKey is not shared with the operator, the operator cannot see the data." },
  21: { q: "A Relay in LoRaWAN is used to:", opts: ["Create a mesh between end-devices", "Extend coverage by forwarding frames from nodes without direct reach to the gateway", "Replace the Network Server at isolated sites", "Increase the permitted duty cycle"], exp: "The relay is a powered device that forwards uplinks and downlinks from nodes in shadow zones (basements, deep indoors). It does not turn the network into a mesh: there is still a single, controlled additional hop." },
  22: { q: "When does a Class A device open its receive windows?", opts: ["Continuously", "Only after each uplink transmission", "Every 128 seconds after the beacon", "When the NS sends a notification"], exp: "Class A is the mandatory baseline: after each uplink it opens RX1 and, if nothing is received, RX2. Outside those windows the radio is off, which gives the lowest consumption but prevents on-demand downlinks." },
  23: { q: "In EU868, what are the default values of RECEIVE_DELAY1 and RECEIVE_DELAY2?", opts: ["1 s and 2 s", "5 s and 6 s", "2 s and 4 s", "0.5 s and 1 s"], exp: "RX1 opens 1 s after the end of the uplink and RX2 exactly 1 s later (RECEIVE_DELAY2 = RECEIVE_DELAY1 + 1 s). For the Join-Accept, JOIN_ACCEPT_DELAY1 = 5 s and DELAY2 = 6 s are used." },
  24: { q: "By default, RX1 in EU868 uses:", opts: ["The same channel as the uplink and the same data rate (with RX1DROffset 0)", "Always 869.525 MHz and DR0", "A random channel among the three default ones", "The beacon channel"], exp: "RX1 reuses the uplink frequency and derives the DR by applying RX1DROffset (0 by default in EU868, i.e. the same DR). RX2 uses fixed parameters: 869.525 MHz and DR0 by default." },
  25: { q: "What does Class B add over Class A?", opts: ["Scheduled receive windows (ping slots) synchronized by beacon", "Continuous reception", "Higher transmit power", "Additional encryption of the FRMPayload"], exp: "Class B synchronizes the node with beacons transmitted by the gateways every 128 s and opens periodic ping slots. It allows bounded downlink latency with a power consumption between A and C." },
  26: { q: "The beacon period in Class B is:", opts: ["30 s", "64 s", "128 s", "256 s"], exp: "The beacon interval is 128 s, divided into a reserved window, the beacon window and a guard time. Within each period the node opens between 1 and 128 ping slots according to the negotiated periodicity (2^(7−k))." },
  27: { q: "A Class C device:", opts: ["Listens on RX2 continuously except when transmitting or in RX1", "Only listens after each uplink", "Does not need to open RX1", "Requires beacons to operate"], exp: "Class C keeps the RXC window (RX2 parameters) permanently open, closing it only during transmission and during RX1. Minimum latency, but a power consumption incompatible with small batteries." },
  28: { q: "Which class must every LoRaWAN device support?", opts: ["Class A", "Class B", "Class C", "Classes A and C"], exp: "Class A is the mandatory base mode. B and C are optional extensions, and a device can temporarily switch to Class C (for example, during a FUOTA campaign) and return to A." },
  29: { q: "If a Class B node loses beacon synchronization for more than two hours:", opts: ["It disconnects from the network", "It automatically switches to Class C", "It enters a minimal mode and eventually returns to Class A", "It restarts the OTAA join"], exp: "After losing the beacon the node enters beacon-less mode, progressively widening its ping slot windows to absorb clock drift. Once that period has elapsed (about 2 hours), it leaves Class B and notifies the server." },
  30: { q: "What is the essential difference between OTAA and ABP?", opts: ["ABP is more secure because it exchanges no messages", "ABP does not use encryption", "OTAA only works in Class C", "OTAA dynamically negotiates DevAddr and session keys on every join"], exp: "In OTAA the device runs the join procedure and obtains a fresh DevAddr and session keys. In ABP they are programmed at the factory and never change, which makes key rotation and counter management difficult." },
  31: { q: "How many bytes does the MIC of a LoRaWAN frame occupy, and with which algorithm is it computed?", opts: ["2 bytes, CRC-16", "4 bytes, AES-128 CMAC", "8 bytes, HMAC-SHA256", "4 bytes, CRC-32"], exp: "The Message Integrity Code is 4 bytes obtained with AES-128 in CMAC mode over the whole frame. Payload encryption uses AES-128 in CTR mode, with different keys." },
  32: { q: "In LoRaWAN 1.0.x, which session keys are derived from the AppKey during the join?", opts: ["NwkSKey and AppSKey", "FNwkSIntKey and SNwkSIntKey", "NwkSEncKey and JSIntKey", "Only the AppSKey"], exp: "In 1.0.x the only root key is the AppKey, from which NwkSKey (integrity and MAC commands) and AppSKey (application payload encryption) are derived. In 1.1 there are two root keys, NwkKey and AppKey, and four session keys." },
  33: { q: "What does a Join-Request contain?", opts: ["DevAddr, FCnt and MIC", "NetID, DevAddr and CFList", "Encrypted AppKey and DevEUI", "JoinEUI, DevEUI and DevNonce"], exp: "The Join-Request is 18 bytes: JoinEUI (8), DevEUI (8) and DevNonce (2), plus the MIC. It is sent unencrypted, but its integrity is protected with the root key, so only the Join Server can validate it." },
  34: { q: "The Join-Accept is cryptographically protected:", opts: ["With the newly derived NwkSKey", "By applying the AES decrypt operation with the root key, so that the node encrypts to recover it", "With TLS between gateway and node", "It is not protected, it is sent in the clear"], exp: "The server applies the AES decrypt operation to the Join-Accept using the root key; the device recovers it by applying the encrypt operation. This way the node only needs to implement the AES encryption primitive." },
  35: { q: "Which optional fields can the Join-Accept include in addition to JoinNonce, NetID, DevAddr, DLSettings and RxDelay?", opts: ["The AppSKey in the clear", "The device's DevEUI", "The 16-byte CFList with additional channels", "The list of nearby gateways"], exp: "The optional CFList occupies 16 bytes and allows the server to communicate additional channels (in EU868, up to five more frequencies) or channel masks depending on the region. Without it the Join-Accept payload is 12 bytes; with it, 28." },
  36: { q: "As of LoRaWAN 1.0.3, the DevNonce must be:", opts: ["A new random value on each attempt", "Derived from the FCntUp", "The same value programmed at the factory", "A monotonically incrementing counter that never repeats"], exp: "The change from random to monotonic counter prevents Join-Request replay attacks. The server rejects any DevNonce equal to or lower than one already seen, so resetting that counter on the node without resetting it on the server breaks joins." },
  37: { q: "What is the greatest operational risk of using ABP?", opts: ["That the node cannot use ADR", "That it does not support Class A", "That the payload cannot be encrypted", "That a device reset resets the frame counters and the server discards the frames"], exp: "With ABP the counters live in non-volatile memory; if they are lost on reset, the NS interprets them as replays and discards the frames. Disabling the counter check as a workaround opens the door to replay attacks." },
  38: { q: "In LoRaWAN 1.1, which key protects the integrity of uplinks from the perspective of the serving Network Server?", opts: ["AppSKey", "SNwkSIntKey", "NwkSEncKey", "JSEncKey"], exp: "1.1 splits network integrity: FNwkSIntKey (forwarding) and SNwkSIntKey (serving) generate a 4-byte MIC in two halves, which allows roaming without giving up full control. NwkSEncKey encrypts the MAC commands." },
  39: { q: "A replay attack on uplinks is prevented mainly by:", opts: ["The Sync Word", "The FCntUp frame counter verified by the server", "The physical-layer CRC", "Channel rotation"], exp: "The NS keeps the last accepted FCntUp and discards frames with a repeated or lower counter. This is why persistent counter management is critical, especially in ABP." },
  40: { q: "What is the correct order of the PHYPayload fields?", opts: ["MHDR | MACPayload | MIC", "Preamble | MIC | MACPayload", "MHDR | MIC | MACPayload", "FHDR | MHDR | MIC"], exp: "PHYPayload = MHDR (1 byte) + MACPayload + MIC (4 bytes). In turn, MACPayload = FHDR + FPort (optional) + FRMPayload (optional)." },
  41: { q: "Which MType value corresponds to an Unconfirmed Data Up?", opts: ["000", "110", "100", "010"], exp: "The MTypes are: 000 Join-Request, 001 Join-Accept, 010 Unconfirmed Data Up, 011 Unconfirmed Data Down, 100 Confirmed Data Up, 101 Confirmed Data Down, 110 Rejoin-Request and 111 Proprietary." },
  42: { q: "An FPort field with value 0 indicates that:", opts: ["The frame is empty", "The FRMPayload contains only MAC commands", "It is certification traffic", "The port is reserved by the manufacturer"], exp: "FPort = 0 means the FRMPayload carries MAC commands encrypted with the network key. Ports 1–223 are application ports, 224 is reserved for the certification test protocol and 225–255 are reserved." },
  43: { q: "How many bytes does the FOpts field occupy at most?", opts: ["8", "32", "16", "15"], exp: "FOpts admits up to 15 bytes of piggybacked MAC commands inside the FHDR, unencrypted in 1.0.x. If they do not fit, they must be sent in the FRMPayload with FPort 0, and in that case there can be no application data in the same frame." },
  44: { q: "The FHDR is composed of:", opts: ["DevEUI, FCnt and FCtrl", "JoinEUI, DevNonce and FCtrl", "MHDR, FPort and MIC", "DevAddr, FCtrl, FCnt and FOpts"], exp: "FHDR = DevAddr (4 bytes) + FCtrl (1) + FCnt (2, the 16 least significant bits of a 32-bit counter) + FOpts (0–15). The rest of the counter is inferred at the server." },
  45: { q: "The ADR bit of the FCtrl field indicates that:", opts: ["The server forces a channel change", "The device allows the network to manage its data rate and power", "The frame requires confirmation", "There are pending MAC commands"], exp: "ADR=1 means the node delegates the adjustment of DR and power to the network. ADRACKReq is used by the node to request confirmation that the network still hears it; FPending tells the node that the server has more downlinks queued." },
  46: { q: "The transmitted FCnt field has 16 bits, but the real counter is 32 bits. How is this resolved?", opts: ["The server reconstructs the upper 16 bits by following the sequence and detecting the rollover", "The node sends the upper 16 bits in the FPort", "The counter is reset every 65536 frames", "Two consecutive frames are used"], exp: "Only the lower 16 bits are transmitted to save air time; both ends keep the 32 bits and the server infers the rollover. That full counter is used in the MIC computation and in the encryption block." },
  47: { q: "In a frame with application data, which key encrypts the FRMPayload?", opts: ["AppSKey", "NwkSKey", "AppKey", "JSIntKey"], exp: "If FPort > 0, the FRMPayload is encrypted with the AppSKey. If FPort = 0 (MAC commands), it is encrypted with the NwkSKey in 1.0.x or the NwkSEncKey in 1.1." },
  48: { q: "A Confirmed Data Up implies that:", opts: ["The server must respond with a downlink carrying the ACK bit", "The gateway sends an immediate acknowledgement", "The frame is always retransmitted three times", "The node switches to Class C"], exp: "The ACK travels in the ACK bit of the FCtrl of a downlink, which may be an empty frame or carry data. Confirmed messages consume the gateway's downlink budget and their massive use saturates network capacity." },
  49: { q: "Which MAC command does the device use to learn the link quality and the number of gateways that hear it?", opts: ["DevStatusReq", "LinkADRReq", "LinkCheckReq", "RXParamSetupReq"], exp: "LinkCheckReq (CID 0x02) is sent by the node; the LinkCheckAns response returns the demodulation margin in dB and the number of gateways that received the frame. It is the basic coverage diagnostic tool from the node side." },
  50: { q: "The LinkADRReq command allows the server to adjust:", opts: ["Only the data rate", "Data rate, transmit power, channel mask and number of retransmissions", "The beacon period", "The RX1 delay"], exp: "LinkADRReq (0x03) carries DataRate_TXPower, ChMask, and Redundancy with ChMaskCntl and NbTrans. The response confirms separately whether the power, the data rate and the channel mask were accepted." },
  51: { q: "In EU868, the default values of ADR_ACK_LIMIT and ADR_ACK_DELAY are:", opts: ["32 and 16", "64 and 32", "16 and 8", "128 and 64"], exp: "After 64 uplinks without a downlink, the end-device sets ADRACKReq. If no response arrives within the next 32, it starts the backoff: it raises the TX power to maximum, then lowers the data rate step by step and finally restores the default channels." },
  52: { q: "Which command returns the device's battery level and demodulation SNR?", opts: ["DevStatusReq / DevStatusAns", "LinkCheckReq / Ans", "DeviceTimeReq / Ans", "DutyCycleReq"], exp: "DevStatusReq (0x06) is initiated by the server. The answer carries a battery byte (0 = externally powered, 1–254 scale, 255 = cannot be measured) and the signed SNR margin of the last received frame." },
  53: { q: "DeviceTimeReq is used to:", opts: ["Synchronize the end-device clock with the network's GPS time", "Adjust the RX2 timer", "Request the beacon period", "Schedule a deferred downlink"], exp: "DeviceTimeReq/Ans (0x0D, since 1.0.3) returns the network time referenced to GPS. It is the usual mechanism for an end-device to enter Class B or synchronize timestamps without its own GPS." },
  54: { q: "The DutyCycleReq command imposes:", opts: ["An aggregated duty-cycle limit on the device", "The regulatory duty cycle of the band", "A maximum number of retransmissions", "The time between beacons"], exp: "DutyCycleReq (0x04) sets MaxDCycle, an aggregated limit that the server imposes on the end-device for network reasons, additional to and independent of the regulatory limit of each sub-band." },
  55: { q: "What happens if ADR is enabled on a mobile device?", opts: ["It works better than on a fixed one", "It has no effect at all", "The server detects it and disables it by itself", "It may get stuck at a high data rate and lose coverage when it moves"], exp: "ADR assumes stable radio conditions. For mobile devices the recommendation is to disable it and set a conservative data rate, or rely on network mechanisms that react quickly to link loss." },
  56: { q: "NewChannelReq allows:", opts: ["Defining the frequency and data-rate range of an additional channel", "Changing the RX2 channel", "Adding a gateway to the end-device's list", "Modifying the Sync Word"], exp: "NewChannelReq (0x07) creates or deletes uplink channels by indicating frequency and DRRange. To modify the downlink frequency of an existing channel, DlChannelReq (0x0A) is used, and RXParamSetupReq (0x05) changes RX2 and the RX1DROffset." },
  57: { q: "The NbTrans parameter of LinkADRReq defines:", opts: ["The number of gateways required", "The number of ping slots", "The number of active channels", "How many times each unconfirmed uplink is repeated"], exp: "NbTrans indicates the repetitions of each uplink frame to improve the probability of reception. It multiplies power consumption and spectrum occupancy, so raising it is a trade-off decision." },
  58: { q: "What are the three mandatory default channels in EU868?", opts: ["868.1 / 868.3 / 868.5 MHz", "868.0 / 868.2 / 868.4 MHz", "869.4 / 869.5 / 869.6 MHz", "867.1 / 867.3 / 867.5 MHz"], exp: "Every EU868 device must implement 868.1, 868.3 and 868.5 MHz with DR0–DR5. Additional channels arrive via the CFList in the Join-Accept or via NewChannelReq." },
  59: { q: "In EU868, which data rate corresponds to SF7 with 125 kHz bandwidth?", opts: ["DR0", "DR3", "DR5", "DR6"], exp: "In EU868: DR0=SF12, DR1=SF11, DR2=SF10, DR3=SF9, DR4=SF8, DR5=SF7 (all at 125 kHz), DR6=SF7/250 kHz and DR7=FSK 50 kbps." },
  60: { q: "The default RX2 parameters in EU868 are:", opts: ["868.5 MHz and DR5", "868.1 MHz and DR0", "867.9 MHz and DR3", "869.525 MHz and DR0"], exp: "RX2 uses 869.525 MHz with DR0 (SF12/125 kHz) by default. That frequency lies in a sub-band with a 10% duty cycle and higher power, intended for downlink." },
  61: { q: "The 1% duty-cycle limit in the 868 MHz sub-band means that:", opts: ["Only 1% of the channels can be used", "After transmitting for 1 s you must wait about 99 s in that sub-band", "1% of the frames can be confirmed", "Radiated power is limited to 1%"], exp: "It is a regulatory restriction per sub-band and per transmitter: the accumulated time on air may not exceed 1% of each hour. It also applies to the gateway, which seriously limits downlink capacity." },
  62: { q: "In US915, the uplink channel plan includes:", opts: ["8 channels of 125 kHz", "72 channels of 250 kHz", "16 channels of 250 kHz", "64 channels of 125 kHz plus 8 of 500 kHz"], exp: "US915 defines 64 channels of 125 kHz starting at 902.3 MHz with 200 kHz spacing (DR0–DR3) and 8 channels of 500 kHz starting at 903.0 MHz (DR4), plus 8 downlink channels of 500 kHz starting at 923.3 MHz." },
  63: { q: "In US915 there is no duty cycle, but there is:", opts: ["A dwell-time limit and frequency hopping", "A limit on frames per day", "A ban on downlink", "A restriction to Class A"], exp: "The FCC requires frequency hopping and a maximum dwell time per channel (400 ms dwell time), which in practice forbids SF12 on 125 kHz channels and constrains the payload size at DR0." },
  64: { q: "In EU868, the maximum application payload at DR0 is approximately:", opts: ["11 bytes", "115 bytes", "51 bytes", "242 bytes"], exp: "In EU868 the value N is 51 bytes for DR0–DR2, 115 for DR3 and 242 for DR4 and above. That margin shrinks if there are MAC commands in FOpts, so the payload should be designed for the worst data rate." },
  65: { q: "The document that defines the frequency plans per region is called:", opts: ["LoRaWAN Link Layer Specification", "Backend Interfaces", "Regional Parameters (RP002)", "LoRaWAN Certification Protocol"], exp: "The Link Layer (TS001) defines the protocol, and Regional Parameters (RP002) specifies frequencies, data rates, powers, delays and restrictions for EU868, US915, AS923, AU915, IN865, KR920, RU864, CN470 and more." },
  66: { q: "AS923 is characterized by:", opts: ["A plan identical to EU868", "A configurable frequency offset in several groups (AS923-1 to -4)", "Not supporting OTAA", "Operating at 2.4 GHz"], exp: "AS923 is defined as a base plan with frequency offsets that produce several regional groups depending on the country, and in some markets dwell time applies in addition to local duty-cycle restrictions." },
  67: { q: "When planning a deployment, the main advantage of installing the gateway antenna at a greater height is:", opts: ["Reducing the gateway's power consumption", "Allowing more spreading factors", "Increasing the radiated power", "Widening the radius of the clear Fresnel zone and the line of sight"], exp: "Height improves the line of sight and clears the first Fresnel zone, which dominates the losses on long links. Gaining height usually pays off more than increasing antenna gain, and it also reduces the need for high SFs." },
  68: { q: "In EU868 the usual radiated power limit for an end-device in the default bands is:", opts: ["25 mW (14 dBm ERP)", "500 mW", "100 mW in all sub-bands", "1 W"], exp: "The default bands allow 25 mW ERP, that is 14 dBm ERP (16 dBm EIRP). Some sub-bands, such as 869.4–869.65 MHz used for RX2, allow 500 mW with a 10% duty cycle." },
  69: { q: "FUOTA in LoRaWAN relies on a set of application-layer packages that include:", opts: ["Clock synchronization, multicast setup and fragmented block transport", "A new dedicated MType", "A specific Class D", "A reserved channel at 870 MHz"], exp: "FUOTA combines Application Layer Clock Synchronization, Remote Multicast Setup, Fragmented Data Block Transport and Firmware Management, over reserved application ports. Delivery is usually done in multicast with the end-device temporarily switched to Class B or C." },
  70: { q: "Network-based geolocation in LoRaWAN usually relies on:", opts: ["TDoA using GPS-synchronized timestamps at several gateways", "RSSI triangulation only", "The position field of the FHDR", "Querying the Join Server"], exp: "TDoA requires gateways with fine GPS-disciplined timestamps and at least three receivers, with typical accuracy of tens to hundreds of meters. RSSI gives much coarser estimates and is used as a fallback." },
  71: { q: "A typical symptom of downlink capacity saturation in a cell is:", opts: ["An increase in confirmed frames without ACK and in the gateway's duty cycle", "An increase in the average SNR", "A drop in the number of joins", "A reduction in the average time on air"], exp: "The gateway is subject to its own duty-cycle limit and cannot receive while transmitting. An excess of confirmed frames or MAC commands exhausts that budget: ACKs are lost, the end-device retransmits and the congestion feeds back on itself." },
  72: { q: "The LoRaWAN Certified program mainly provides:", opts: ["Verification that the device complies with the protocol and the regional parameters", "A coverage guarantee", "A spectrum usage license", "The DevEUI assignment"], exp: "Certification validates the device's behavior against the specification and the regional parameters using authorized test benches. It does not replace regulatory certification (CE/RED, FCC) nor guarantee field performance." },
  73: { q: "To maximize the battery life of a sensor reporting hourly, the most effective measure is usually:", opts: ["Always using confirmed frames", "Fixing SF12 to be safe", "Reducing time on air through ADR and compact payloads", "Increasing NbTrans to 3"], exp: "Consumption is dominated by radio-active time. Lowering the SF with ADR, compressing the payload and avoiding unnecessary confirmations reduces the time on air and, with it, the energy per message and the spectrum occupancy." },
  74: { q: "When sizing the capacity of a cell, why do nodes at SF12 impose a disproportionate penalty?", opts: ["They use more channels", "They occupy the air tens of times longer than SF7 nodes for the same payload", "They require additional downlinks", "They force the gateway to change band"], exp: "It is the airtime capture effect: a message at SF12 can occupy more than 30 times the time of the same message at SF7. A small percentage of nodes at the edge of coverage can consume most of the cell's capacity." },
  75: { q: "Which modulation, other than LoRa and LR-FHSS, does LoRaWAN support at some data rates?", opts: ["OFDM", "DSSS", "QPSK", "FSK (GFSK)"], exp: "The LoRaWAN PHY defines three modulations: LoRa, FSK and LR-FHSS. FSK is typically used at the highest data rate of some regions (DR7 in EU868)." },
  76: { q: "At what bit rate does the LoRaWAN FSK mode operate?", opts: ["1,200 bit/s", "9,600 bit/s", "250,000 bit/s", "50,000 bit/s"], exp: "The FSK settings table fixes a bit rate of 50,000 bit/s, with a frequency deviation of 25 kHz and a receive bandwidth of 50 kHz." },
  77: { q: "In the LoRaWAN FSK mode, payload integrity is protected with:", opts: ["Reed-Solomon", "AES-128 CMAC", "Whitening only", "CRC-16-CCITT"], exp: "The CRC-16-CCITT is computed over the length and content of the PHYPayload. Whitening coding avoids non-uniform power distributions, but does not protect integrity." },
  78: { q: "In FCC-type regions, over how many physical channels does an LR-FHSS transmission hop?", opts: ["35", "128", "86", "60"], exp: "In ETSI it hops among 35 or 86 channels depending on the hopping bandwidth; in FCC there are 60 channels on a 25.4 kHz grid." },
  79: { q: "What physical bit rate does LR-FHSS offer with coding rate 2/3?", opts: ["162 bit/s", "5,470 bit/s", "325 bit/s", "980 bit/s"], exp: "LR-FHSS offers 162 bit/s with CR 1/3 and 325 bit/s with CR 2/3, far below the rates of classic LoRa, in exchange for much more robustness in dense deployments." },
  80: { q: "In the physical structure of a LoRa packet, what comes immediately after the preamble?", opts: ["The CRC", "The PHDR_CRC", "The PHYPayload", "The Synchronization Word"], exp: "The order is: preamble, Sync Word, PHDR (physical header), PHDR_CRC, PHYPayload and CRC (uplink only)." },
  81: { q: "Class B beacons are transmitted in:", opts: ["Explicit header mode with CRC", "LR-FHSS", "FSK with whitening", "Implicit header mode, with fixed length"], exp: "In implicit mode neither PHDR nor PHDR_CRC is sent: all receivers know the fixed length of the beacon in advance." },
  82: { q: "Which coding rate does LoRaWAN conformance require in LoRa mode?", opts: ["Fixed 4/8", "Variable according to ADR", "Fixed 4/5", "It depends on the bandwidth"], exp: "Although the LoRa chip supports several coding rates, LoRaWAN requires a fixed 4/5 in both uplink and downlink to be compliant." },
  83: { q: "How must a device configure IQ polarity on uplink versus downlink?", opts: ["The same in both directions", "Random", "Inverted in both", "Not inverted on uplink, inverted on downlink"], exp: "Inverting the IQ polarity of the downlink prevents an end-device from mistakenly listening to the transmissions of other end-devices as if they were network traffic." },
  84: { q: "The 'repeater-compatible payload size' in RP002 is defined because:", opts: ["It only affects beacons", "Repeaters duplicate the CRC", "It changes the spreading factor", "A repeater encapsulates the original frame adding up to 20 bytes of metadata"], exp: "In order not to exceed the 250-byte MACPayload maximum when encapsulating, the 'repeater compatible' payload tables reserve margin for that metadata." },
  85: { q: "In LR-FHSS, what mainly determines the payload time on air?", opts: ["The spreading factor", "The number of preambles", "The hopping bandwidth", "The coding rate (1/3 or 2/3) and the payload length"], exp: "LR-FHSS does not use SF: the payload time on air is computed from the coding rate and the number of bytes, with a separate repeated physical header." },
  86: { q: "Which field of the LoRa PHDR in explicit mode specifies, among other things, the payload length?", opts: ["The Sync Word", "The preamble", "The PHDR itself, which also indicates the coding rate and the presence of a CRC", "The PHYPayload"], exp: "The PHDR is inserted by the radio transceiver itself, not by the LoRaWAN stack, and is protected by its own PHDR_CRC." },
  87: { q: "The payload CRC in LoRa (explicit mode) protects:", opts: ["Downlink only", "Both uplink and downlink equally", "Uplink only; LoRaWAN downlinks do not carry it", "Neither uplink nor downlink"], exp: "Downlinks do not need a payload CRC because the LoRaWAN MIC itself already guarantees the end-to-end integrity of the frame." },
  88: { q: "Which of the modulations supported by LoRaWAN does not use chirp spread spectrum?", opts: ["LoRa", "LR-FHSS", "FSK (GFSK)", "All of them use chirps"], exp: "FSK is a classic narrowband modulation; LoRa uses chirps and LR-FHSS combines spread spectrum with fast frequency hopping." },
  89: { q: "Which backend message does the Network Server use to start forwarding an uplink in passive roaming?", opts: ["JoinReq", "AppSKeyReq", "PRStartReq", "RejoinReq"], exp: "PRStartReq/PRStartAns are part of the Passive Roaming Start messages between the visited fNS and the home sNS." },
  90: { q: "In the Network Reference Model (NRM) of Backend Interfaces, which server keeps the Device Profile, the Service Profile and the Routing Profile?", opts: ["The Forwarding NS", "The Serving NS", "The Home NS", "The Visited NS"], exp: "The hNS is where the device's provisioning information and its relationship with the Join Server live; the other NSs only take part in roaming." },
  91: { q: "What distinguishes the Forwarding NS from the Serving NS?", opts: ["The sNS does not take part in roaming", "There is no difference, they are synonyms", "The fNS only exists in Class B", "The fNS manages the radio gateways; the sNS controls the MAC layer"], exp: "When fNS and sNS are different, they are under a roaming agreement: the fNS forwards frames from its gateways and the sNS maintains the device session." },
  92: { q: "The unique identifier of a Network Server in Backend Interfaces is:", opts: ["The NetID", "The JoinEUI", "The DevAddr", "The NSID (EUI-64)"], exp: "Each NS has its own NSID and may be configured with one or more NetIDs, which identify the network to the devices." },
  93: { q: "Which NetID values do not require a request to the LoRa Alliance?", opts: ["Any NetID below 0x000010", "Type 7 NetIDs", "All NetIDs are free to use", "The values 0x000000 and 0x000001, reserved for experimental networks or networks without roaming"], exp: "Apart from those two reserved values, a network that wants to roam needs a unique NetID assigned by the LoRa Alliance." },
  94: { q: "The Type field of the NetID (the 3 most significant bits) determines:", opts: ["The supported LoRaWAN version", "Whether the network supports Class B", "The network's country", "The length of the ID field and therefore the network size it can address"], exp: "The seven NetID types split the bits differently between the network identifier and the room for device addresses." },
  95: { q: "The record that documents a device's activity after its join in Backend Interfaces is called:", opts: ["Network Traffic Record", "Session Report", "Network Activation Record", "Join Log"], exp: "The Network Activation Record is generated at activation; the subsequent traffic is summarized in the Network Traffic Record." },
  96: { q: "Which profile describes the device's capabilities (supported class, LoRaWAN version, activation type) in Backend Interfaces?", opts: ["Service Profile", "Routing Profile", "Device Profile", "Network Profile"], exp: "The Service Profile describes what the customer subscribes to (traffic limits, quality), whereas the Device Profile describes the device itself." },
  97: { q: "The Routing Profile in Backend Interfaces mainly defines:", opts: ["The session keys", "The regional frequency plan", "How to route messages to the Join Server and between servers in roaming", "The beacon interval"], exp: "It is the routing information an NS needs to know which Join Server or other NS each message must be directed to." },
  98: { q: "How does a device's passive roaming end according to Backend Interfaces?", opts: ["It never ends explicitly", "Automatically every 24 hours", "With a Passive Roaming Stop procedure initiated by the fNS or the sNS", "When the device changes class"], exp: "Both the visited NS and the home NS can terminate the passive roaming agreement explicitly, not only by expiration." },
  99: { q: "The 'Periodic Recovery' mechanism of Backend Interfaces relies on:", opts: ["The LinkCheckReq command", "The original Join-Request repeated", "Physically resetting the device", "The device periodically transmitting a Rejoin-Request type 1 in case the sNS has lost its state"], exp: "It is the way to recover connectivity if the Network Server completely loses the session context of a 1.1 device." },
  100: { q: "The 'Rekeying and DevAddr Reassignment' of Backend Interfaces relies on:", opts: ["The LinkCheckReq command", "Physically resetting the device", "The Rejoin-Request type 2, handled without disconnecting the device", "The original Join-Request"], exp: "It allows renewing the keys or reassigning the DevAddr of an active device without interrupting its application traffic." },
  101: {
    q: "The 'Key Transport Security' section of Backend Interfaces deals with:",
    opts: [
      "Authenticating the application's end user",
      "Encrypting the application FRMPayload",
      "Signing the firmware in a FUOTA campaign",
      "Protecting the delivery of session keys between the Join Server, Network Server and Application Server"
    ],
    exp: "Session keys travel between servers over channels that must guarantee authenticity, integrity and confidentiality, not just over the radio link."
  },
  102: {
    q: "The 'Result Codes' section of Backend Interfaces defines:",
    opts: [
      "The device class codes",
      "The region codes",
      "The result codes returned by backend messages (success, error, etc.)",
      "The codes that make up the MIC"
    ],
    exp: "Every HTTP/JSON message between servers can be answered with a standardized ResultCode in addition to its specific payload."
  },
  103: {
    q: "In Backend Interfaces, the tables in the document are normative; what are the figures?",
    opts: [
      "Normative as well",
      "They replace the tables",
      "They apply only to 1.0 devices",
      "Informative"
    ],
    exp: "The document convention distinguishes tables (mandatory) from figures (illustrative), as in most LoRa Alliance specifications."
  },
  104: {
    q: "Who negotiates the commercial and technical agreement that enables roaming between two operators?",
    opts: [
      "The end-device itself",
      "The Join Server, automatically",
      "The LoRa Alliance, on every connection",
      "It is handled out of band between the operators; Backend Interfaces only defines the technical messaging"
    ],
    exp: "The specification standardizes how roaming messages are exchanged, not the commercial terms of the agreement between networks."
  },
  105: {
    q: "What does it imply that the link between the gateway and the Network Server is not covered by Backend Interfaces?",
    opts: [
      "The gateway cannot be monitored",
      "Gateways cannot connect to third-party networks",
      "Each gateway manufacturer may use its own packet forwarder protocol",
      "The Network Server cannot receive frames"
    ],
    exp: "Backend Interfaces standardizes NS-JS, JS-AS and NS-NS; the gateway-NS segment is out of its scope, hence the variety of packet forwarders."
  },
  106: {
    q: "What happens if a Class A device receives nothing in RX1 or RX2?",
    opts: [
      "It automatically retries the uplink",
      "It sends a Rejoin-Request",
      "It switches to Class B",
      "It turns off the radio until its next uplink"
    ],
    exp: "Class A has no guaranteed downlink: if nothing arrives in either of the two windows, the node goes back to sleep."
  },
  107: {
    q: "In Class B, if the node receives a frame during its ping slot:",
    opts: [
      "It stops listening on the next ping slot",
      "It disconnects from the network",
      "It can process a unicast or multicast downlink just as in RX1",
      "It automatically switches to Class C"
    ],
    exp: "The ping slot works as one more receive window: it accepts both unicast and multicast frames, each with its own format."
  },
  108: {
    q: "The classB bit of FCtrl in an uplink indicates:",
    opts: [
      "That MAC commands are pending",
      "That the frame is confirmed",
      "That the node supports Class B and can receive ping slots",
      "That the beacon has been lost"
    ],
    exp: "It is the same bit that Class A uses as ADR: in Class B uplinks it is reinterpreted to signal the availability of ping slots."
  },
  109: {
    q: "Which mechanism prevents two gateways from transmitting the same beacon at different instants?",
    opts: [
      "Only one gateway per cell may transmit beacons",
      "The Network Server delays one of the two",
      "GPS synchronization of the gateways to a common time reference",
      "It is not needed; beacons do not collide"
    ],
    exp: "Beacon accuracy depends on all gateways in the network sharing the same time reference, typically GPS."
  },
  110: {
    q: "In Class B, the FPending bit of a ping-slot downlink indicates that:",
    opts: [
      "The node must retry the uplink",
      "The beacon has been lost",
      "The server has more data pending after this ping slot",
      "The ping slot has expired"
    ],
    exp: "It tells the node that it would be advisable to open more ping slots or wait for the next one to collect the rest of the downlink queue."
  },
  111: {
    q: "In Class C, which window replaces RX2 when the node is neither transmitting nor in RX1?",
    opts: [
      "RX1, permanently",
      "An RX3 window exclusive to Class C",
      "None; Class C adds no windows",
      "RXC, with the same parameters as RX2"
    ],
    exp: "RXC reuses the RX2 configuration but is kept open continuously, except while transmitting and during RX1."
  },
  112: {
    q: "Which MAC command announces a temporary class change to the server, for example during a FUOTA campaign?",
    opts: [
      "ClassCReq",
      "ClassSwitchReq",
      "DeviceModeInd / DeviceModeConf",
      "FUOTAModeReq"
    ],
    exp: "It is the Class C-specific command that lets the device announce that it has temporarily changed class and confirm the switch back."
  },
  113: {
    q: "Into which intervals is the 128 s beacon period of Class B divided?",
    opts: [
      "Uplink and downlink in equal parts",
      "Only consecutive ping slots",
      "Beacon reserved, beacon window and beacon guard",
      "RX1 and RX2"
    ],
    exp: "The reserved interval precedes the beacon transmission and the guard absorbs small timing drifts before the next period."
  },
  114: {
    q: "The GwSpecific field of the beacon frame may contain:",
    opts: [
      "The complete channel plan",
      "The AppSKey",
      "The list of active devices in the cell",
      "The gateway's GPS coordinates, or its NetID and GatewayID"
    ],
    exp: "It is information specific to the transmitting gateway, useful for example so that the device can estimate its own position."
  },
  115: {
    q: "From which root key are JSIntKey and JSEncKey derived?",
    opts: [
      "AppKey",
      "NwkSEncKey",
      "AppSKey",
      "NwkKey"
    ],
    exp: "Both are lifetime keys derived from NwkKey using AES-128, specifically intended to protect the rejoin procedure, not the data session."
  },
  116: {
    q: "What is JSIntKey specifically used for?",
    opts: [
      "Encrypting the application FRMPayload",
      "Synchronizing the Class B clock",
      "Deriving the AppSKey",
      "Computing the MIC of Rejoin-Request type 1 messages and of the Join-Accept messages that answer a rejoin"
    ],
    exp: "Only the Join Server knows JSIntKey, which guarantees that only it can validate a Rejoin-Request type 1."
  },
  117: {
    q: "What is JSEncKey used for?",
    opts: [
      "Deriving the DevAddr",
      "Signing the initial Join-Request",
      "Encrypting the FOpts field",
      "Encrypting the Join-Accept that answers a Rejoin-Request"
    ],
    exp: "A Join-Accept triggered by a normal Join-Request is encrypted with NwkKey; one triggered by a rejoin is encrypted with JSEncKey."
  },
  118: {
    q: "In LoRaWAN 1.1, when the OptNeg bit of the Join-Accept is set to 0, the device must:",
    opts: [
      "Reject the join",
      "Immediately send a Rejoin-Request type 1",
      "Use NwkKey and AppKey separately anyway",
      "Revert to a single set of keys derived from NwkKey, as in 1.0"
    ],
    exp: "This is the compatibility mechanism for 1.0 Network Servers: FNwkSIntKey, SNwkSIntKey and NwkSEncKey are set to a single, identical value."
  },
  119: {
    q: "What distinguishes the NFCntDown counter from AFCntDown in LoRaWAN 1.1?",
    opts: [
      "NFCntDown is used only in uplink",
      "They are synonyms for the same counter",
      "NFCntDown counts MAC-command downlinks (port 0); AFCntDown counts application downlinks",
      "AFCntDown exists only in Class B"
    ],
    exp: "Separating both counters lets the network session and the application session evolve independently, in line with the rest of the 1.1 separation."
  },
  120: {
    q: "What replaces, in LoRaWAN 1.1, the single FCntDwn that existed in 1.0?",
    opts: [
      "It stays the same; it does not change",
      "It is merged with FCntUp",
      "It is removed; there is no downlink counter anymore",
      "It is split into NFCntDown and AFCntDown, one for the network session and one for the application session"
    ],
    exp: "It is a direct consequence of separating the network session (NS) from the application session (AS) in the 1.1 key model."
  },
  121: {
    q: "A Rejoin-Request type 0 is used to:",
    opts: [
      "Restore a lost session by querying the Join Server",
      "Change only the DevAddr without touching the keys",
      "Completely reset the device context (DevAddr, session keys and radio parameters) without going through the Join Server",
      "Synchronize the Class B clock"
    ],
    exp: "It can only be verified by the serving or home Network Server; unlike type 1, it is never routed to the Join Server."
  },
  122: {
    q: "A Rejoin-Request type 1 differs from type 0 in that:",
    opts: [
      "It carries no anti-replay counter",
      "It can only be transmitted by an ABP device",
      "It contains JoinEUI and DevEUI, and only the Join Server can verify its MIC",
      "It changes the device class"
    ],
    exp: "It is routed like an original Join-Request: any Network Server that receives it forwards it to the corresponding Join Server."
  },
  123: {
    q: "A Rejoin-Request type 2 allows:",
    opts: [
      "Requesting a new Join Server",
      "Restoring a lost DevEUI",
      "Rekeying or changing the DevAddr while keeping the radio parameters unchanged",
      "Changing the device's regional plan"
    ],
    exp: "Unlike type 0, type 2 does not touch the device's radio configuration, only the keys and optionally the DevAddr."
  },
  124: {
    q: "The RJcount0 counter, used in Rejoin-Request types 0 and 2, is reset to zero:",
    opts: [
      "Every 24 hours",
      "Never",
      "Every time a Join-Accept is successfully processed",
      "When changing class"
    ],
    exp: "It is a 16-bit counter that must never wrap around: if it reaches 2^16−1, the device must stop transmitting that type of rejoin."
  },
  125: {
    q: "Which key is used to compute the MIC of a Rejoin-Request type 0 or 2?",
    opts: [
      "NwkKey",
      "JSIntKey",
      "SNwkSIntKey",
      "AppSKey"
    ],
    exp: "Unlike type 1, which uses JSIntKey, types 0 and 2 are verified by the Network Server with the already established SNwkSIntKey session key."
  },
  126: {
    q: "The ForceRejoinReq command allows the server to:",
    opts: [
      "Block the uplink for a fixed time",
      "Permanently expel the device from the network",
      "Change the device's DevEUI",
      "Force the device to immediately transmit a Rejoin-Request type 0 or 2, with programmable periodicity and retries"
    ],
    exp: "It is the way for the network to proactively initiate a rekeying or a roaming handover, instead of waiting for the device to do it on its own."
  },
  127: {
    q: "The ResetInd/ResetConf command of LoRaWAN 1.1 is intended for:",
    opts: [
      "Any device, both OTAA and ABP",
      "ABP devices that have lost their MAC context in RAM after a reset, without resetting the frame counters",
      "Forcing a new Join-Request",
      "Synchronizing the clock after leaving Class B"
    ],
    exp: "OTA devices must never implement it: their context is naturally re-established through the join procedure."
  },
  128: {
    q: "What is NOT reset by the ResetInd command of an ABP device?",
    opts: [
      "The default radio parameters",
      "The frame counters (uplink and downlink), which are never reset in ABP",
      "The MAC context in RAM",
      "Nothing; everything is reset"
    ],
    exp: "This is the guarantee against replay: even if the device loses its state in RAM, the counters persisted in non-volatile memory keep protecting the session."
  },
  129: {
    q: "The RekeyInd command sent by the device after a successful Join-Accept serves to:",
    opts: [
      "Request a new root key",
      "Confirm to the server that it is already using the new security context, so that it can discard the previous one",
      "Request a class change",
      "Cancel the join in progress"
    ],
    exp: "Until an uplink carrying RekeyInd arrives, the server keeps both the old and the new security context alive."
  },
  130: {
    q: "The Limit_exp parameter of the ADRParamSetupReq command sets ADR_ACK_LIMIT as:",
    opts: [
      "Limit_exp directly, in number of frames",
      "2 raised to the power Limit_exp",
      "Limit_exp multiplied by 64",
      "Always 64; it is not configurable"
    ],
    exp: "Both ADR_ACK_LIMIT and ADR_ACK_DELAY are encoded as powers of two, which allows a wide range to be represented in a single byte."
  },
  131: {
    q: "The JoinReqType field included in the Join-Accept MIC computation serves to:",
    opts: [
      "Define the beacon interval",
      "Indicate the device's language",
      "Select the regional plan",
      "Prevent a Join-Accept intended for one request type from being reused as the answer to another"
    ],
    exp: "By including the request type in the MIC computation, a Join-Accept valid for a Rejoin-Request type 1 cannot serve as a forged answer to another type."
  },
  132: {
    q: "Which JoinReqType value corresponds to an original Join-Request, not to a rejoin?",
    opts: [
      "0x00",
      "0xFF",
      "0x01",
      "0x02"
    ],
    exp: "0x00, 0x01 and 0x02 identify Rejoin-Request types 0, 1 and 2 respectively; 0xFF is reserved for the original Join-Request."
  },
  133: {
    q: "When a Join-Accept answers a Rejoin-Request (type 0, 1 or 2), which key is it encrypted with?",
    opts: [
      "With NwkKey, just like a normal Join-Request",
      "With JSEncKey",
      "With AppSKey",
      "It is not encrypted"
    ],
    exp: "Only the Join-Accept that answers an original Join-Request uses NwkKey; any rejoin triggers the use of JSEncKey."
  },
  134: {
    q: "Which session keys are regenerated when a Rejoin-Request type 2 succeeds?",
    opts: [
      "None; type 2 changes nothing",
      "All four session keys, even though the radio parameters do not change",
      "Only the AppSKey",
      "Only the network keys"
    ],
    exp: "Type 2 is designed precisely to renew keys (rekeying), even though it keeps the radio configuration exactly as it was."
  },
  135: {
    q: "If the CFList is present after a Rejoin-Request type 2, what happens to the device's channels?",
    opts: [
      "It is ignored; type 2 never changes channels",
      "The CFList overwrites the current channels; if it is absent, they remain unchanged",
      "They always revert to the default channels",
      "The existing channels are duplicated"
    ],
    exp: "This differs from the behavior after a Join-Request or a type 0/1 rejoin, where the absence of a CFList does imply reverting to the default channels."
  },
  136: {
    q: "Which element is not part of the Join-Accept according to the 1.1 specification?",
    opts: [
      "The Home_NetID",
      "The JoinNonce",
      "The device's DevEUI",
      "The DLSettings"
    ],
    exp: "The DevEUI does not travel in the Join-Accept: the server already knows it because it arrived in the Join-Request or the rejoin that triggered the response."
  },
  137: {
    q: "The RxDelay field of the Join-Accept follows the same encoding convention as:",
    opts: [
      "The CFListType",
      "The FOpts field",
      "The NetID",
      "The Delay field of the RXTimingSetupReq command"
    ],
    exp: "Reusing the same encoding simplifies implementation: both fields express the same type of delay between TX and RX."
  },
  138: {
    q: "What length can the encrypted Join-Accept have depending on whether it includes a CFList?",
    opts: [
      "Always 16 bytes",
      "16 bytes without CFList, or 32 bytes with CFList",
      "Always 32 bytes",
      "Variable, with no limit"
    ],
    exp: "AES encryption works on 16-byte blocks, so adding the 16-byte CFList exactly doubles the encrypted size."
  },
  139: {
    q: "In the LoRaWAN 1.0 key derivation tree, how many distinct session keys are derived (versus the four in 1.1)?",
    opts: [
      "Four, the same as in 1.1",
      "A single key for everything",
      "Two: NwkSKey and AppSKey",
      "Three"
    ],
    exp: "1.1 adds the split of network integrity into two halves (FNwkSIntKey/SNwkSIntKey) and a MAC-command encryption key (NwkSEncKey), designed for roaming."
  },
  140: {
    q: "What guarantees that a Rejoin-Request type 1 cannot be replayed in a replay attack?",
    opts: [
      "The Sync Word",
      "Encryption of the whole message",
      "The RJcount1 counter, which the Join Server never accepts if it is less than or equal to the last one seen",
      "The duty-cycle limit"
    ],
    exp: "RJcount1 is a separate counter, distinct from RJcount0, and can never wrap around during the device's lifetime."
  },
  141: {
    q: "How often is it recommended to transmit a Rejoin-Request type 1?",
    opts: [
      "Never; only on demand from the server",
      "Every second",
      "Mandatorily once per hour",
      "At least once a month"
    ],
    exp: "It is a low-traffic recovery mechanism: it serves to restore the session if the server loses it completely, not for routine maintenance."
  },
  142: {
    q: "What maximum duty cycle is recommended for transmitting Rejoin-Request type 0 or 2?",
    opts: [
      "No special limit",
      "Always below 0.1%",
      "A maximum of once per second",
      "The same 1% as the rest of the traffic"
    ],
    exp: "Regardless of the regulatory limit of the sub-band, the specification itself bounds the use of these rejoins so as not to saturate the network."
  },
  143: {
    q: "What happens to the old security context when the server processes a Rejoin-Request and generates a new Join-Accept?",
    opts: [
      "It is discarded immediately",
      "It is kept alongside the new one until the first successful uplink with the new context is received",
      "It is merged with the new one",
      "It is sent back to the device"
    ],
    exp: "It is the same caution applied to a normal Join-Request: the previous context is not abandoned until the new one is confirmed to work."
  },
  144: {
    q: "In LoRaWAN 1.1, if a device joins a Network Server that only supports 1.0, what happens to its keys?",
    opts: [
      "The join always fails",
      "OptNeg is set to 0 and the device derives the keys as in 1.0, making FNwkSIntKey, SNwkSIntKey and NwkSEncKey identical",
      "The device forces 1.1 mode anyway",
      "The AppSKey is lost"
    ],
    exp: "It is the backward-compatibility mechanism that lets a 1.1 device operate unchanged on a network that has not yet migrated."
  },
  145: {
    q: "Which FCtrl bit of a downlink indicates that the server has more data queued?",
    opts: [
      "ADR",
      "ACK",
      "FPending",
      "ClassB"
    ],
    exp: "FPending only makes sense in downlink; in uplink that same FCtrl position is used for other bits, such as ADRACKReq."
  },
  146: {
    q: "The ADRACKReq bit in an uplink lets the node:",
    opts: [
      "Indicate that there are MAC commands in FOpts",
      "Request a class change",
      "Request a Rejoin-Request",
      "Ask the server to confirm that it can still hear it, as part of the ADR mechanism"
    ],
    exp: "It is the signal that triggers the ADR backoff if the server does not respond: the node starts to suspect it has lost coverage."
  },
  147: {
    q: "How many bits does the FOptsLen subfield occupy within FCtrl?",
    opts: [
      "2 bits",
      "4 bits",
      "8 bits",
      "6 bits"
    ],
    exp: "4 bits are just enough to encode 0 to 15, the maximum number of bytes that FOpts can carry."
  },
  148: {
    q: "The 1-byte MHDR consists of:",
    opts: [
      "DevAddr and FCtrl",
      "Only the MType",
      "MType (3 bits), RFU (3 bits) and Major (2 bits)",
      "FPort and FOpts"
    ],
    exp: "The 3 RFU bits are reserved for future use; today they do not distinguish any behavior in the frames."
  },
  149: {
    q: "Which Major value identifies the current version of the LoRaWAN frame (R1)?",
    opts: [
      "00",
      "11",
      "01",
      "10"
    ],
    exp: "The Major field has only 2 bits, but so far all published LoRaWAN versions use the same value, 00."
  },
  150: {
    q: "The B0 block used in the uplink MIC computation includes:",
    opts: [
      "Only the DevAddr",
      "A direction byte (Dir), the DevAddr, the FCntUp and the message length",
      "The AppKey in the clear",
      "The NetID"
    ],
    exp: "Building the block with these fields prevents an attacker from reusing a valid MIC by changing the counter or the direction of the frame."
  },
  151: { q: "The Dir field of the encryption block and of the MIC block indicates:", opts: ["The frame direction, 0 for uplink and 1 for downlink", "The antenna direction", "The roaming direction", "Whether the end-device is fixed or mobile"], exp: "Including Dir in the block prevents a captured uplink frame from being reused, with the same counter, as if it were a valid downlink." },
  152: { q: "The FType value '111' (Proprietary) in the MHDR is reserved for:", opts: ["Proprietary use outside the LoRaWAN standard", "The Join-Accept", "Extended MAC commands", "Multicast traffic"], exp: "It allows a manufacturer to define its own frame format on top of the same PHY, without interfering with the other standardized types." },
  153: { q: "Which field is NOT part of the FHDR of a LoRaWAN frame?", opts: ["The FPort", "The DevAddr", "The FCtrl", "The FCnt"], exp: "The FPort comes after the FHDR, as a separate field of the MACPayload, not as part of the frame header." },
  154: { q: "In the Ai block used to encrypt the FRMPayload, what is the role of the block counter i?", opts: ["It generates a different key stream for each 16-byte block using AES in counter mode", "It numbers the packets on the air", "It determines the spreading factor", "It is only used when encrypting the Join-Accept"], exp: "This is what turns AES into a stream cipher: each payload block is XORed with a different Ai, generated from the counter." },
  155: { q: "How does the downlink MIC computation differ from the uplink one in LoRaWAN 1.1?", opts: ["No difference, the same key and the same block are used", "The downlink uses a single B0 block with SNwkSIntKey; the uplink combines the cmac of two different keys", "The downlink carries no MIC", "The downlink uses the AppSKey for the MIC"], exp: "Splitting the uplink MIC between FNwkSIntKey and SNwkSIntKey is what allows partial verification in roaming scenarios; the downlink does not need it." },
  156: { q: "Which key encrypts the FRMPayload when FPort = 0 on a LoRaWAN 1.1 Network Server?", opts: ["The AppSKey", "The NwkSEncKey", "The NwkKey directly", "It is not encrypted, it is sent in the clear"], exp: "In 1.0.x that same function is fulfilled by the NwkSKey; in 1.1 it is specialized into the NwkSEncKey, separate from the integrity keys." },
  157: { q: "The RXParamSetupAns command separately confirms the acceptance of:", opts: ["RX1DROffset, RX2 data rate and RX2 channel", "Power, data rate and uplink channel", "ADR, duty cycle and class", "FOpts, FPort and FCnt"], exp: "By acknowledging each parameter separately, the server knows exactly which of the three the end-device could not apply." },
  158: { q: "The NewChannelAns command separately confirms:", opts: ["Whether the data rate range was accepted and whether the channel frequency was accepted", "Only whether the channel was created", "The total number of available channels", "The maximum allowed power"], exp: "Like other configuration commands, it separates the acknowledgement of each field to better diagnose a partial rejection." },
  159: { q: "TxParamSetupReq allows the server to adjust:", opts: ["The end-device's maximum EIRP and maximum dwell time, in regions that require it", "The RX2 channel", "The beacon period", "The number of join retries"], exp: "It is only relevant in regions where regulation limits EIRP or imposes a maximum dwell time, as is the case in some AS923 groups." },
  160: { q: "The PingSlotInfoReq command allows a Class B end-device to:", opts: ["Inform the server of its desired ping slot periodicity", "Request the beacon period", "Change the uplink channel", "Request a Rejoin-Request"], exp: "It is the end-device that decides how many ping slots it wants to open per beacon period, within the system limits." },
  161: { q: "The BeaconFreqReq command is used to:", opts: ["Change the frequency on which the end-device expects the beacon", "Request the network time", "Adjust the duty cycle", "Confirm the Join-Accept"], exp: "It is useful in channel plans with beacon frequency hopping, to realign the end-device if it has lost synchronization." },
  162: { q: "RejoinParamSetupReq allows the server to:", opts: ["Configure the periodicity with which the end-device automatically transmits Rejoin-Request type 0", "Force an immediate rejoin", "Change the DevEUI", "Define the number of ADR retries"], exp: "It is the usual way to schedule periodic rejoins; ForceRejoinReq, by contrast, triggers an immediate one on demand." },
  163: { q: "The LinkADRAns command confirms three aspects separately:", opts: ["Data rate, power and RX2 channel", "Power, data rate and channel mask", "FOpts, FPort and FCnt", "Class, band and sync word"], exp: "If any of the three is rejected, the end-device applies none of the proposed changes: LinkADRReq is treated as a whole." },
  164: { q: "Which MAC command has CID 0x03?", opts: ["DutyCycleReq", "LinkADRReq", "RXParamSetupReq", "DevStatusReq"], exp: "The low CIDs (0x02 to 0x0A in 1.0.x) correspond to the commands defined since the first version of the specification." },
  165: { q: "Which MAC command corresponds to CID 0x06?", opts: ["NewChannelReq", "DevStatusReq", "RXParamSetupReq", "DlChannelReq"], exp: "DevStatusReq is always initiated by the server to learn the end-device's battery status and SNR." },
  166: { q: "Which CID identifies DlChannelReq?", opts: ["0x07", "0x08", "0x0A", "0x0D"], exp: "DlChannelReq shares its purpose with NewChannelReq (0x07) but is limited to modifying the downlink frequency of an already existing channel." },
  167: { q: "DeviceTimeReq uses the CID:", opts: ["0x0A", "0x0B", "0x0C", "0x0D"], exp: "It is one of the most recent commands in the base series, introduced in LoRaWAN 1.0.3." },
  168: { q: "What is the advantage of setting NbTrans > 1 on a very marginal link?", opts: ["It increases the probability that at least one repetition gets through, at the cost of more time on air and power consumption", "It reduces the node's power consumption", "It eliminates the need for ADR", "It increases the available duty cycle"], exp: "It is a trade-off tool: it improves worst-case reliability, but multiplies spectrum occupancy and energy per message." },
  169: { q: "Which mechanism does the Network Server use to know whether an end-device is still in coverage before the link fails completely?", opts: ["The LinkCheckReq history and the reported demodulation margin", "The Rejoin-Request type 1", "The duty cycle limit", "The Sync Word"], exp: "LinkCheckAns gives a snapshot of the margin and of the number of gateways that hear the end-device, useful as an early indicator." },
  170: { q: "If an end-device accepts the data rate but rejects the channel mask of a LinkADRReq, what does it finally apply?", opts: ["Only the data rate", "None of the three parameters of the command", "All of them, because the partial rejection does not count", "The region's default channels"], exp: "LinkADRReq is accepted or rejected as an atomic set: there is no partial application of its three fields." },
  171: { q: "What distinguishes RXTimingSetupReq from RXParamSetupReq?", opts: ["The former adjusts the delay between the end of the uplink and RX1; the latter adjusts the frequency and data rate of RX1/RX2", "They are exact synonyms", "The former only applies to Class B", "The latter has no acknowledgement response"], exp: "Changing the delay (RECEIVE_DELAY1) is a different operation from reconfiguring where and at what data rate the end-device listens." },
  172: { q: "The DutyCycleReq command can impose an aggregated duty cycle that is:", opts: ["Less restrictive than the regulatory limit of the sub-band, never more", "More restrictive than the regulatory limit, at the network operator's discretion", "Only applicable to beacons", "Only applicable in Class C"], exp: "It is an additional restriction that the operator can impose for network capacity reasons, independent of the legal limit of the band." },
  173: { q: "In US915, which SF and BW correspond to DR0?", opts: ["SF7/125 kHz", "SF10/125 kHz", "SF12/500 kHz", "SF8/500 kHz"], exp: "US915 starts at SF10 (not SF12 as in EU868) because the 400 ms dwell time makes the highest spreading factors impractical at 125 kHz." },
  174: { q: "In US915, which configuration corresponds to DR4?", opts: ["SF8/500 kHz", "SF7/125 kHz", "SF12/500 kHz", "LR-FHSS"], exp: "DR4 uses 500 kHz of bandwidth, which reduces the time on air enough not to collide with the dwell time limit." },
  175: { q: "In US915, data rates DR8 to DR13 are used exclusively for:", opts: ["Emergency uplink", "Downlink, with SF12 to SF7 over 500 kHz", "The Join-Request", "Class B beacons"], exp: "US915 downlink lives in its own range of data rates and channels, completely separate from the uplink." },
  176: { q: "How is the RX1 channel determined from the uplink channel in US915?", opts: ["It is always channel 0", "Uplink channel modulo 8", "It is chosen at random", "It is the same as the uplink channel"], exp: "With 64 uplink channels and only 8 downlink channels, the modulo 8 rule deterministically assigns which RX1 channel corresponds to each one." },
  177: { q: "What range of values does RX1DROffset allow in US915?", opts: ["0 to 3", "0 to 7", "0 to 15", "Only 0"], exp: "Values 4 to 7 are reserved for future use, unlike other regions with different ranges." },
  178: { q: "In US915, what do data rates DR5 and DR6 correspond to?", opts: ["LR-FHSS with 1.523 MHz bandwidth (CR 1/3 and 2/3)", "SF7 and SF8 at 500 kHz", "Downlink-only channels", "Reserved, unused data rates"], exp: "LR-FHSS shares the same 8 channels of 500 kHz as DR4, but with a completely different modulation." },
  179: { q: "How many Class B beacon channels does US915 define, and in what range?", opts: ["8, from 923.3 to 927.5 MHz every 600 kHz", "1 single fixed channel", "64, the same as the uplink", "16 channels"], exp: "They coincide with the 8 data downlink channels: the beacon rotates among them according to the beacon number." },
  180: { q: "A freshly reset personalized (ABP) US915 end-device has enabled:", opts: ["Only the first 8 channels", "All 72 channels", "None, until it receives NewChannelReq", "Only the 64 channels of 125 kHz"], exp: "Without a Join-Accept restricting the list, an ABP end-device starts with the entire 72-channel structure active." },
  181: { q: "Which transmission mode of the FCC rules allows up to +30 dBm in US915 with frequency hopping?", opts: ["DTS (Digital Transmission System)", "FHSS (Frequency-Hopping Spread Spectrum)", "Hybrid mode", "LBT"], exp: "In exchange for that power, the FHSS mode requires hopping among at least 50 channels and respecting the 400 ms dwell time." },
  182: { q: "How many dedicated downlink channels does US915 define, and in what frequency range?", opts: ["8 channels, from 923.3 to 927.5 MHz", "64 channels, from 902 to 915 MHz", "16 channels, at 869 MHz", "There are no dedicated downlink channels"], exp: "Unlike EU868, where the downlink reuses the uplink channels, US915 completely separates both directions." },
  183: { q: "AU915 shares a channel structure similar to that of:", opts: ["EU868", "US915, with 64+8 channels and its own frequency offset", "AS923", "CN470"], exp: "Both regions were born from the same fixed-channel philosophy with a wide set of frequencies, adapted to each local regulation." },
  184: { q: "IN865 is characterized, compared with other regions, by:", opts: ["Having no strict duty cycle limit, with only three default channels", "Requiring LBT mandatorily", "Defining 96 channels", "Prohibiting the use of OTAA"], exp: "Its regulation is more permissive than the European one regarding duty cycle, although the default channel plan is small." },
  185: { q: "CN470 stands out from the other regions for:", opts: ["Defining up to 96 channels, with specific downlink plans depending on the antenna type", "Not supporting Class B", "Being identical to EU868", "Using only 500 kHz bandwidth"], exp: "It is the region with the most channels of all those covered by RP002, designed for the Chinese market and its own band restrictions." },
  186: { q: "RU864 is structurally similar to:", opts: ["EU868, with the band shifted", "US915", "AS923", "KR920"], exp: "It shares its channel plan philosophy with EU868, adapted to the spectrum allocation available in Russia." },
  187: { q: "According to the RP002 revision history, what changed for AS923 at Data Rate 2 regarding the maximum payload size?", opts: ["It was reduced due to dwell time restrictions", "It was increased compared with previous versions of the specification", "That data rate was removed", "It has never changed"], exp: "It is one of the adjustments documented in the revision notes of RP002-1.0.1, which aligned that value with the other equivalent regions." },
  188: { q: "AS923-4 was added in a revision of RP002 to cover:", opts: ["917-920 MHz, providing coverage for Israel", "A new European country", "The 2.4 GHz band", "South Korea"], exp: "It is an example of how the base AS923 plan is extended with new offset groups as countries are added." },
  189: { q: "EU433 differs from EU868 mainly in:", opts: ["Only the frequency band; the rest of the plan follows a very similar philosophy", "Not supporting Class B", "Having no duty cycle limit", "Requiring LBT"], exp: "EU433 reuses the same European regulatory logic of duty cycle per sub-band, only shifted to the 433 MHz band." },
  190: { q: "CN779-787 is a region defined in RP002 intended for:", opts: ["Residual use in 779-787 MHz with a channel plan similar to the European one", "Replacing CN470 throughout the country", "Class C end-devices exclusively", "Satellite communication"], exp: "It is one of the least used regions in the document, with a channel plan and restrictions very similar to those of EU868/EU433." },
  191: { q: "What does the link budget of a LoRaWAN deployment measure?", opts: ["The difference between the transmitted power and the receiver sensitivity, minus the path losses", "The number of end-devices supported per cell", "The available duty cycle", "The total battery consumption of the network"], exp: "It is the basic calculation to know whether a given link will work before deploying anything in the field." },
  192: { q: "A sustained increase in the average SNR reported by LinkCheckAns across a whole cell suggests:", opts: ["More interference in the band", "Better propagation conditions or nodes closer to the gateways", "That the duty cycle has been exhausted", "An increase in collisions"], exp: "SNR is a measure of the quality of the received link; its widespread improvement points to propagation causes, not congestion." },
  193: { q: "Why does it make no sense to apply ADR during the join process itself?", opts: ["Because the Join-Request is transmitted with a data rate chosen by the node, with no prior feedback from the server", "Because the Join Server explicitly blocks it", "Because ADR only applies to Class C end-devices", "Because the Join-Request has no FCtrl"], exp: "ADR needs a history of frames already exchanged with the server, which does not yet exist before the join is completed." },
  194: { q: "What advantage does deploying several overlapping gateways in the same area provide?", opts: ["Receive diversity: a higher probability that at least one receives each uplink", "It doubles the available duty cycle", "It allows higher transmit power", "It eliminates the need to use ADR"], exp: "It is the usual strategy to improve reliability without raising power or spreading factor, although it does not avoid the downlink duty cycle limit." },
  195: { q: "When planning network capacity, which combination is most limiting for the downlink?", opts: ["Many simultaneous joins with confirmed frames and high spreading factors", "Few end-devices at SF7", "Unconfirmed uplinks in Class A", "End-devices operating in ABP mode"], exp: "Every acknowledgement and every Join-Accept consumes the gateway's downlink budget, which is already the scarcest resource." },
  196: { q: "What role does the fade margin play in a link budget calculation?", opts: ["It compensates for the variability of real propagation compared with the theoretical model", "It replaces the sensitivity calculation", "It determines the allowed duty cycle", "It replaces the antenna gain"], exp: "Without that margin, a link that works on paper can fail intermittently due to rain, vegetation or simple variability of the environment." },
  197: { q: "When migrating end-devices from ABP to OTAA, which risk should be managed first?", opts: ["None, the migration is transparent", "Coordinating the retirement of old counters and keys to avoid session collisions", "The change of frequency band", "The loss of the DevEUI"], exp: "Letting the old ABP session coexist with a new OTAA session without deactivating the former can cause DevAddr or counter conflicts." },
  198: { q: "What does a sustained increase in the number of Rejoin-Request type 1 messages in a network indicate?", opts: ["Loss of session state in the Network Server with some frequency", "A successful replay attack", "A failure in the physical layer", "A massive class change of the end-devices"], exp: "Type 1 exists precisely for that recovery scenario; seeing it frequently is a sign of a stability problem in the server." },
  199: { q: "Why is it relevant to review DevNonce management on legacy ABP end-devices during a security audit?", opts: ["Because ABP uses neither DevNonce nor Join-Request, so what matters is the persistence of the FCnt, not of the DevNonce", "Because ABP also generates a DevNonce per session", "Because the DevNonce protects the FRMPayload", "Because the DevNonce replaces the AppSKey"], exp: "Confusing the protection mechanisms of OTAA and ABP is a common mistake: in ABP the critical point is the persistence of the frame counters." },
  200: { q: "Which LoRaWAN mechanism reduces the impact of a replay attack against the Join-Request?", opts: ["The Sync Word", "The DevNonce, a monotonic counter verified by the server", "The duty cycle limit", "The physical layer CRC"], exp: "A DevNonce already used or lower than the last one seen makes the server discard the Join-Request, even if the rest of the message is valid." },
  201: { q: "When sizing how many gateways a cell needs, which resource should be calculated first: uplink or downlink capacity?", opts: ["The uplink, because it is always scarcer", "The downlink, because the gateway is half-duplex and its duty cycle is shared by all the end-devices in the cell", "Neither, both are unlimited", "It depends only on the number of gateways installed"], exp: "The uplink scales with the number of end-devices because each one has its own regulatory budget; the downlink is shared by all of them through the same gateway, which moreover cannot receive while transmitting." },
};
