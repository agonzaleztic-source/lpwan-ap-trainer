/* English lesson bodies, by lesson id. Spanish (src/data/lessons.js) is the source of truth;
   same blocks, same order, same shape. Titles and checks live in titles.en.js / checks.en.js. */
export const LESSON_BODIES_EN_3 = {
  reg1: [
    {
      t: "p",
      x: "LoRaWAN operates in unlicensed bands, and those bands are regulated differently in each part of the world: different frequencies, different power limits and, above all, different philosophies for controlling channel occupancy. The protocol specification (TS001) is single and universal; everything that depends on geography lives in a separate document, the Regional Parameters (RP002).",
    },
    {
      t: "key",
      x: "TS001 defines what frames and commands look like. RP002 defines on which frequencies, with which data rates, at what power and under which restrictions transmissions are made. Knowing what is in each document is itself exam material.",
    },
    { t: "h", x: "Anatomy of a regional plan" },
    { t: "p", x: "Every regional plan specifies the same set of elements:" },
    {
      t: "list",
      x: [
        "The default channels that every device must implement out of the box, which allow joining without prior configuration.",
        "The mapping between data rate and radio parameters: which SF and bandwidth are DR0, DR1, and so on.",
        "The maximum payload size allowed at each data rate.",
        "The transmit power levels and their maximum value.",
        "The default RX1 and RX2 parameters and the receive delays.",
        "The occupancy restrictions: duty cycle, dwell time, or both.",
      ],
    },
    { t: "h", x: "Two control philosophies" },
    {
      t: "table",
      head: ["", "Duty cycle", "Dwell time with frequency hopping"],
      rows: [
        ["Where", "Europe and regions that follow ETSI", "North America and regions that follow the FCC"],
        ["What it limits", "The percentage of time a sub-band is occupied", "The maximum duration of a transmission on a channel"],
        ["Typical value", "1% per hour in the default bands", "400 ms per transmission"],
        ["Practical effect", "Few messages per hour, especially at high SFs", "SF12 is not viable on 125 kHz channels"],
      ],
    },
    {
      t: "p",
      x: "Both approaches pursue the same goal — that nobody monopolizes the shared spectrum — by opposite paths. The European one limits how much you talk in total; the American one limits how long each sentence lasts, forcing you to change channels.",
    },
    {
      t: "warn",
      x: "The fact that the United States has no duty cycle does not mean you can transmit without limit: dwell time restricts the duration of each message and forces channel rotation. This is a frequent mistake in comparison questions.",
    },
    { t: "h", x: "How a device learns additional channels" },
    {
      t: "p",
      x: "A device starts out knowing only the default channels of its region. From there there are two paths: the optional CFList in the Join-Accept, which delivers additional channels or a mask all at once, and the NewChannelReq command, which adds or removes them one by one during the session. ABP devices, since they receive no Join-Accept, depend exclusively on the latter.",
    },
  ],
  reg2: [
    {
      t: "p",
      x: "This is the plan that is asked about most and the one you will probably use. It is worth memorizing in full.",
    },
    { t: "h", x: "Channels" },
    {
      t: "p",
      x: "Three mandatory channels that every device must implement: 868.1, 868.3 and 868.5 MHz, all with 125 kHz bandwidth and supporting DR0 to DR5. They are the ones used for joining, which is why no device can do without them.",
    },
    {
      t: "p",
      x: "Most networks add five more channels, typically 867.1, 867.3, 867.5, 867.7 and 867.9 MHz, communicated via CFList or NewChannelReq, up to the usual eight of a standard gateway.",
    },
    { t: "h", x: "Data rates" },
    {
      t: "table",
      head: ["DR", "Configuration", "Bit rate", "Application payload"],
      rows: [
        ["DR0", "SF12 / 125 kHz", "250 bit/s", "51 B"],
        ["DR1", "SF11 / 125 kHz", "440 bit/s", "51 B"],
        ["DR2", "SF10 / 125 kHz", "980 bit/s", "51 B"],
        ["DR3", "SF9 / 125 kHz", "1,760 bit/s", "115 B"],
        ["DR4", "SF8 / 125 kHz", "3,125 bit/s", "242 B"],
        ["DR5", "SF7 / 125 kHz", "5,470 bit/s", "242 B"],
        ["DR6", "SF7 / 250 kHz", "11,000 bit/s", "242 B"],
        ["DR7", "GFSK 50 kbps", "50,000 bit/s", "242 B"],
      ],
    },
    {
      t: "key",
      x: "The mnemonic rule: in EU868 the DR number and the SF add up to 17 between DR0 and DR5. DR0 is SF12, DR5 is SF7. DR6 and DR7 are the special cases of 250 kHz and GFSK.",
    },
    { t: "h", x: "Receive windows" },
    {
      t: "p",
      x: "RX1 uses the uplink frequency and the data rate resulting from applying RX1DROffset, which defaults to 0 (same data rate as the uplink). RX2 uses 869.525 MHz with DR0. That frequency lies in the 869.4 to 869.65 MHz sub-band, which allows 500 mW of power and a 10% duty cycle: the fallback downlink has the most generous channel in the plan.",
    },
    { t: "h", x: "Power and occupancy" },
    {
      t: "table",
      head: ["Sub-band", "Power", "Duty cycle"],
      rows: [
        ["868.0 – 868.6 MHz", "25 mW (14 dBm ERP)", "1%"],
        ["868.7 – 869.2 MHz", "25 mW", "0.1%"],
        ["869.4 – 869.65 MHz", "500 mW", "10%"],
      ],
    },
    {
      t: "warn",
      x: "Be careful with ERP and EIRP: 14 dBm ERP is equivalent to 16 dBm EIRP, because the dipole reference differs from the isotropic one by 2.15 dB. Exam questions often mix both units.",
    },
    { t: "h", x: "Practical consequence of the 1% limit" },
    {
      t: "p",
      x: "With a 12-byte message at SF12 (about 1,483 ms of time on air), the 1% limit allows about 24 messages per hour and forces you to wait almost 150 seconds between transmissions. The same message at SF7 occupies 62 ms, which leaves room for more than 500 messages per hour. The difference between a design that works and one that does not is almost always right there.",
    },
  ],
  reg3: [
    { t: "h", x: "US915" },
    {
      t: "p",
      x: "The North American plan is structurally different from the European one. In the uplink it defines 64 channels of 125 kHz starting at 902.3 MHz with 200 kHz spacing, which support DR0 to DR3, plus 8 channels of 500 kHz starting at 903.0 MHz with 1.6 MHz spacing, which support DR4. In the downlink there are 8 channels of 500 kHz starting at 923.3 MHz, with 600 kHz spacing.",
    },
    {
      t: "table",
      head: ["Aspect", "EU868", "US915"],
      rows: [
        ["Uplink channels", "3 mandatory + additional", "64 x 125 kHz + 8 x 500 kHz"],
        ["Downlink channels", "Same as the uplink + RX2", "8 dedicated 500 kHz"],
        ["Restriction", "1% duty cycle", "400 ms dwell time"],
        ["RX2", "869.525 MHz, DR0", "923.3 MHz, DR8 (SF12/500 kHz)"],
        ["Slowest usable SF", "SF12", "SF10 on 125 kHz because of dwell time"],
      ],
    },
    {
      t: "p",
      x: "The number of channels creates a problem of its own: an 8-channel gateway covers only a fraction of the 64 available. Hence the concept of the sub-band, a group of 8 channels of 125 kHz plus one of 500 kHz. Devices must know which sub-band the network operates in, or they will waste join attempts by transmitting on channels nobody is listening to.",
    },
    {
      t: "warn",
      x: "Joining in US915 is a classic source of problems: if the device tries all 72 channels and the gateway listens on only 8, most attempts are lost. That is why many devices allow the sub-band to be fixed at the factory.",
    },
    { t: "h", x: "AS923" },
    {
      t: "p",
      x: "AS923 is not a single plan but a base plan with frequency offsets that produce several regional groups, AS923-1 to AS923-4, depending on the country. The protocol and the data rates are common; what changes is the frequency offset. Some countries also apply dwell time and others local duty-cycle restrictions, which makes it the most heterogeneous plan.",
    },
    { t: "h", x: "Other regions worth recognizing" },
    {
      t: "table",
      head: ["Plan", "Region", "Distinguishing feature"],
      rows: [
        ["AU915", "Australia", "Structure similar to US915 with its own channels"],
        ["IN865", "India", "Three default channels, no strict duty cycle"],
        ["KR920", "Korea", "Requires listen before talk (LBT)"],
        ["CN470", "China", "96 channels, with specific downlink plans"],
        ["RU864", "Russia", "Similar to EU868 with a shifted band"],
      ],
    },
    {
      t: "key",
      x: "What to take to the exam is not every plan by heart, but the axes that set them apart: number and width of channels, restriction mechanism (duty cycle, dwell time or LBT), RX2 parameters, and whether the downlink uses dedicated channels or the uplink ones.",
    },
    {
      t: "p",
      x: "A final note: LR-FHSS appears as additional data rates in several regional plans, in the uplink only. It is intended for very high device densities and for direct reception by low-Earth-orbit satellites, a fast-growing use case.",
    },
  ],
  ops1: [
    {
      t: "p",
      x: "The link budget is the decibel accounting between the transmitter and the receiver. It determines whether a communication is possible before anything is installed.",
    },
    {
      t: "formula",
      x: "margin = P_tx + G_tx − L_tx − L_path + G_rx − L_rx − sensitivity",
      note: "Everything in dB or dBm. If the margin is positive, the link closes on paper.",
    },
    { t: "h", x: "The terms, one by one" },
    {
      t: "list",
      x: [
        "P_tx: transmitter output power. In EU868, 14 dBm ERP at most in the default bands.",
        "G_tx and G_rx: antenna gains. A higher-gain antenna concentrates energy in one plane, it does not create it: it gains horizontal range at the expense of vertical coverage.",
        "L_tx and L_rx: cable and connector losses. With cheap cable at 868 MHz, 3 dB is easily lost in a few meters.",
        "L_path: the real unknown. In free space at 868 MHz, one kilometer costs about 91 dB, but in an urban environment it can cost much more.",
        "Sensitivity: depends on the chosen SF, from −123 dBm at SF7 to −137 dBm at SF12.",
      ],
    },
    {
      t: "key",
      x: "The link budget is where the spreading factor proves its worth: the 14 dB separating SF7 from SF12 add directly to the margin. It is the most powerful lever you have, and also the most expensive in airtime.",
    },
    { t: "h", x: "Propagation models" },
    {
      t: "p",
      x: "The log-distance model expresses the loss as a reference at one kilometer plus a logarithmic growth with exponent n:",
    },
    {
      t: "formula",
      x: "L(d) = L(1 km) + 10·n·log₁₀(d)",
      note: "At 868 MHz, L(1 km) ≈ 91 dB in free space. n ≈ 2 in line of sight, 2.7 in suburban, 3.2 in urban and above 3.5 in dense urban or indoor environments.",
    },
    {
      t: "p",
      x: "That exponent sums up all the complexity of the environment. Going from rural to dense urban can cut the range from kilometers to hundreds of meters with the same equipment.",
    },
    { t: "h", x: "Height and the Fresnel zone" },
    {
      t: "p",
      x: "On long links, what dominates is not power but geometry. The first Fresnel zone is the ellipsoid around the straight line between antennas through which most of the energy travels. If an obstacle intrudes into it, there are diffraction losses even when there is apparent line of sight.",
    },
    {
      t: "warn",
      x: "Raising the gateway antenna usually pays off more than increasing its gain. Height clears the Fresnel zone and widens the radio horizon; gain only redistributes energy and can leave nearby nodes, right below the antenna, without coverage.",
    },
    { t: "h", x: "Fade margin" },
    {
      t: "p",
      x: "A calculation that gives zero margin does not work in the real world. Propagation varies with rain, seasonal vegetation, traffic, and the position of the device inside a utility pit. Common practice is to reserve between 10 and 20 dB of margin over the theoretical calculation and always validate with field measurements before committing to a deployment.",
    },
  ],
  ops2: [
    {
      t: "p",
      x: "LoRaWAN uses pure random medium access: the node transmits whenever it wants, without listening first or asking for a turn. This is what lets the device sleep almost all the time, and it is also what makes capacity degrade non-linearly.",
    },
    { t: "h", x: "The ALOHA model" },
    {
      t: "p",
      x: "Without coordination, two frames that overlap in time, channel and spreading factor collide. The collision probability grows with the square of the offered traffic, so a network that works well at 20% load can fall apart at 40%. The saturation point arrives sooner than intuition suggests.",
    },
    { t: "h", x: "The disproportionate cost of high SFs" },
    {
      t: "p",
      x: "Here is the central idea of this lesson. An identical message occupies the channel for about 62 ms at SF7 and almost 1,500 ms at SF12. A node at the cell edge consumes, for each message, as much airtime as twenty-four nearby nodes.",
    },
    {
      t: "key",
      x: "This is the far-node effect: a small percentage of devices operating at SF11 and SF12 can consume most of the cell's capacity. That is why ADR is not a battery optimization, it is a network capacity measure.",
    },
    { t: "h", x: "Levers for scaling" },
    {
      t: "list",
      x: [
        "Well-tuned ADR: moves each node to the fastest data rate its link tolerates.",
        "More channels: they multiply the dimensions across which traffic is spread.",
        "More gateways: they do not just extend coverage, they bring nodes closer and lower their average spreading factor.",
        "Fewer confirmed frames: each acknowledgement consumes gateway transmission, and the downlink is the scarce resource.",
        "Compact payloads: fewer bytes mean fewer milliseconds of occupancy.",
        "NbTrans at 1 unless necessary: each repetition multiplies occupancy by the same factor.",
      ],
    },
    {
      t: "warn",
      x: "Adding a gateway to a saturated cell does not always solve the uplink problem, because the air is still the same. What it does do is shorten distances and let ADR lower the spreading factors, which is where the real gain lies.",
    },
    { t: "h", x: "Symptoms of saturation" },
    {
      t: "p",
      x: "A cell at its limit can be recognized by specific signs: an increase in confirmed frames without ACK, gateways dropping downlinks because their duty cycle is exhausted, a rise in the average spreading factor, and a delivery rate that falls during the busiest hours. If the nodes also start retransmitting, the congestion feeds on itself.",
    },
    {
      t: "p",
      x: "The right diagnosis is almost never \"we need more gateways\". It is usually \"there are too many nodes at a high SF\" or \"confirmations are being used where they were not needed\".",
    },
  ],
  ops3: [
    { t: "h", x: "Energy budget" },
    {
      t: "p",
      x: "The consumption of a LoRaWAN device is split between sleep current, sensor measurement and the radio. In a well-made design, the radio dominates, and within the radio, transmission time dominates.",
    },
    {
      t: "p",
      x: "The basic calculation is to add up the charge of each activity in microamp-hours and multiply it by the daily frequency. A message at SF7 uses on the order of a tenth of what the same one at SF12 does; a confirmed frame adds listening in RX1 and, if that fails, in RX2 plus the complete retransmission.",
    },
    {
      t: "list",
      x: [
        "Reduce time on air before anything else: it is the lever with the greatest effect.",
        "Avoid confirmations in periodic telemetry; a lost reading rarely justifies the cost.",
        "Watch out for repeated joins: each one is several transmissions plus long listening windows.",
        "Compress the payload, but remember there are 13 bytes of fixed overhead that you cannot eliminate.",
      ],
    },
    { t: "h", x: "FUOTA" },
    {
      t: "p",
      x: "Over-the-air firmware update is possible in LoRaWAN, but it requires coordinating four application-layer pieces:",
    },
    {
      t: "num",
      x: [
        "Clock synchronization, so that all devices in the group share a time reference.",
        "Remote multicast setup, which creates a group with its own key and multicast session.",
        "Fragmented data block transport, which splits the binary into pieces and adds redundancy so that a device can reconstruct the file even if it loses fragments.",
        "Firmware management, which queries versions and commands the application of the image.",
      ],
    },
    {
      t: "p",
      x: "During distribution, devices temporarily switch to Class B or C to be able to receive the stream, and return to Class A when finished. The redundancy of the fragmented transport is what makes the process viable: without it, a single lost fragment would force the whole campaign to be repeated.",
    },
    {
      t: "warn",
      x: "FUOTA is expensive in airtime and in battery. Updating a large fleet consumes a notable fraction of network capacity for hours, and it must be planned outside peak hours and with duty-cycle headroom.",
    },
    { t: "h", x: "Geolocation" },
    {
      t: "p",
      x: "Without GPS on the device, the network can estimate positions by time difference of arrival (TDoA) between GPS-synchronized gateways. At least three receptions are needed, and typical accuracy ranges from tens to hundreds of meters, depending heavily on gateway geometry. The RSSI-based alternative is much coarser and is only good for locating at cell level.",
    },
    { t: "h", x: "Certification" },
    {
      t: "p",
      x: "The LoRaWAN Certified program verifies, on authorized test benches, that a device complies with the specification and the regional parameters: that it respects the receive windows, processes MAC commands correctly, handles counters properly and behaves as it should in its region.",
    },
    {
      t: "key",
      x: "LoRaWAN certification is different from regulatory certification. A device needs CE marking under the RED directive in Europe or FCC certification in the United States in order to be sold; LoRaWAN Certified attests to interoperability, not to the legality of its emissions.",
    },
  ],
};
