import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="main-container animation-fade-in component-container p-6 flex flex-col">
            {TC_TEXTS.map((item, index) => (
                <React.Fragment key={index}>
                    <h3 className="pl-6 py-6">{item.h3}</h3>
                    {item.text}
                </React.Fragment>
            ))}
        </div>
    );
};
export default PrivacyPolicy;

const TC_TEXTS = [
    {
        h3: "WE VALUE YOUR PRIVACY",
        text: (
            <span>
                TitanX Limited and its affiliates (collectively, "TitanX", "we",
                "us") value the privacy of individuals who visit our
                decentralized fundraising platform on the binance blockchain
                (“Platform”), available at https://www.TitanX.org , and any of
                our other websites, applications, or services that link to this
                Privacy Policy (collectively, the "Service"). The Service allows
                accredited, professional and sophisticated investors and other
                users to participate on the Platform ("Users"). This Privacy
                Policy ("Policy") is designed to explain how we collect, use,
                and share information from users of the Service, including
                Users. This Policy is incorporated by reference into our Terms
                of Use. By agreeing to this Policy in your account setup and
                through your continued use of the Service, you agree to the
                terms and conditions of this Policy.
            </span>
        ),
    },
    {
        h3: "WHAT TYPE OF INFORMATION DO WE COLLECT",
        text: (
            <span>
                We collect any information you provide to us when you use the
                Service. You may provide us with information in various ways on
                the Service. Projects that issue a blockchain-based
                cryptographic token and are launched on our Platform (“Token
                Projects”) may provide us with information about their Token
                Project and token offering, certain of which will be provided to
                potential Users to assist in making a decision about
                participating in such Token Projects. Usage information: We may
                collect information about how you access and use our Service,
                your actions on the Service, including your interactions with
                others on the Service, photos or media you upload to the
                Service, comments and posts you make in our public discussion
                forums, and other content you may provide. Technical Data: We
                may collect data such as IP (internet protocol) address, ISP
                (internet service provider), the web browser used to access the
                Service, the time the Service was accessed, which web pages were
                visited, operating system and platform, a mobile device-type
                identifier, and other technology on the devices you use to
                access our Service. Communications: We may receive additional
                information about you when you contact us directly. For example,
                we will receive your email address, the contents of a message or
                attachments that you may send to us, and other information you
                choose to provide when you contact us through email.
            </span>
        ),
    },
    {
        h3: "HOW DO WE USE THE INFORMATION WE COLLECT?",
        text: (
            <span>
                Verifying the identity and accreditation status of Users, which
                may include conducting a soft pull on your credit history, and
                to facilitate participation in listed tokens. Operating,
                maintaining, enhancing and providing features of the Service,
                providing services and information that you request, responding
                to comments and questions, and otherwise providing support to
                users. Understanding and analyzing the usage trends and
                preferences of our users, improving the Service, developing new
                products, services, features, and functionality. Contacting you
                for administrative or informational purposes, including by
                providing customer service or sending communications, including
                changes to our terms, conditions, and policies. For marketing
                purposes, such as developing and providing promotional and
                advertising materials that may be useful, relevant, valuable or
                otherwise of interest. Personalizing your experience on the
                Service by presenting tailored content. We may aggregate data
                collected through the Service and may use and disclose it for
                any purpose. For our business purposes, such as audits,
                security, compliance with applicable laws and regulations, fraud
                monitoring and prevention. Complying with legal and regulatory
                requirements. Protecting our interests, enforcing our Terms of
                Use or other legal rights.
            </span>
        ),
    },
    {
        h3: "WHEN AND WITH WHOM DO WE SHARE THE INFORMATION WE COLLECT?",
        text: (
            <span>
                We do not rent, sell or share your information with third
                parties except as described in this Policy. We may share your
                information with the following: Companies in our group or our
                affiliates in order to provide you with the services. Credit
                bureaus and other third parties who provide Know Your Customer
                and Anti-Money Laundering services, including verifying users as
                accredited investors. Information collected from and about Users
                may be shared with Token Projects to facilitate User-directed
                participation and to communicate independently with you. Our
                third-party service providers who provide services such as data
                storage, website hosting, data analysis, customer service, email
                delivery, auditing, and other services. Potential or actual
                acquirer, successor, or assignee as part of any reorganization,
                merger, sale, joint venture, assignment, transfer or other
                disposition of all or any portion of our business, assets or
                stock (including in bankruptcy or similar proceedings). If
                required to do so by law or in the good faith belief that such
                action is appropriate: (a) under applicable law, including laws
                outside your country of residence; (b) to comply with legal
                process; (c) to respond to requests from public and government
                authorities, including public and government authorities outside
                your country of residence; (d) to enforce our terms and
                conditions; (e) to protect our operations or those of any of our
                subsidiaries; (f) to protect our rights, privacy, safety or
                property, and/or that of our subsidiaries, you or others; and
                (g) to allow us to pursue available remedies or limit the
                damages that we may sustain. In addition, we may use third party
                analytics vendors to evaluate and provide us with information
                about your use of the Service. We do not share your information
                with these third parties, but these analytics service providers
                may set and access their own cookies, pixel tags and similar
                technologies on the Service and they may otherwise collect or
                have access to information about you which they may collect over
                time and across different websites. For example, we use Google
                Analytics to collect and process certain analytics data. Google
                provides some additional privacy options described at
                https://www.google.com/policies/privacy/partners. We may use and
                disclose aggregate information that does not identify or
                otherwise relate to an individual for any purpose, unless we are
                prohibited from doing so under applicable law.
            </span>
        ),
    },
    {
        h3: "THIRD-PARTY SERVICES",
        text: (
            <span>
                We may use third-party service providers to keep, store or
                maintain all your Personal Information. We will, however, use
                reasonable commercial endeavours to ensure any such third-party
                service provider engaged by us to store your Personal
                Information will provide reasonable care and skill in the
                performance of their duties and services. We may also display
                third-party content on the Service. Third-party content may use
                cookies, web beacons, or other mechanisms for obtaining data in
                connection with your viewing of and/or interacting with the
                third-party content on the Service. You should be aware that
                there is always some risk involved in transmitting information
                over the internet. While we strive to protect your Personal
                Information, we cannot ensure or warrant the security and
                privacy of your Personal Information or other content you
                transmit using the service, and you do so at your own risk.
                Please note that we cannot control, nor will we be responsible
                for the Personal Information collected and processed by third
                parties, its safekeeping or a breach thereof, or any other act
                or omission pertaining to it and their compliance with
                applicable privacy laws or regulations. We advise you to read
                the respective privacy policy of any such third party and use
                your best discretion.
            </span>
        ),
    },
    {
        h3: "HOW WE PROTECT YOUR PERSONAL INFORMATION",
        text: (
            <span>
                You acknowledge that no data transmission over the internet is
                totally secure. Accordingly, we cannot warrant the security of
                any information which you transmit to us. That said, we do use
                certain physical, organizational, and technical safeguards that
                are designed to maintain the integrity and security of
                information and we have implemented administrative, technical,
                and physical safeguards to help prevent unauthorized access,
                use, or disclosure of your Personal Information. Your Personal
                Information will be stored on secure servers and will not be
                made publicly available. We will try to limit access of your
                Personal Information only to those employees or partners that
                need to know the Personal Information in order to achieve the
                purposes of processing, as described above. However, as
                described above, we engage third-party service providers to
                store your Personal Information. We cannot control the security
                and privacy of the information stored with our service providers
                but we will use our reasonable commercial endeavours to ensure
                that any such third party service provider has in place certain
                physical, organizational, and technical safeguards that are
                designed to maintain the integrity and security of your Personal
                Information. You need to help us prevent unauthorized access to
                your account by protecting your password appropriately and
                limiting access to your account (for example, by logging out
                after you have finished accessing your account). You will be
                solely responsible for keeping your password confidential and
                for all use of your password and your account, including any
                unauthorized use. While we seek to protect your information to
                ensure that it is kept confidential, we cannot absolutely
                guarantee its security. However, we do not store any passwords
                as an added layer of security. Please be aware that no security
                measures are perfect or impenetrable and thus we cannot and do
                not guarantee the security of your data. While we strive to
                protect your Personal Information, we cannot ensure or warrant
                the security and privacy of your Personal Information or other
                content you transmit using the service, and you do so at your
                own risk. It is important that you maintain the security and
                control of your account credentials, and not share your password
                with anyone. In addition, we offer our users two-factor
                authentication which is designed to protect their account.
            </span>
        ),
    },
    {
        h3: "HOW LONG DO WE KEEP YOUR INFORMATION",
        text: (
            <span>
                Our third-party storage service providers will retain your
                Information for as long as necessary to provide our Services,
                and as necessary to comply with our legal obligations (including
                those specific to financial transactions), resolve disputes, and
                enforce our policies. Retention periods will be determined
                taking into account the type of information that is collected
                and the purpose for which it is collected, bearing in mind the
                requirements applicable to the situation and the need to destroy
                outdated, unused information at the earliest reasonable time.
            </span>
        ),
    },
    {
        h3: "YOUR RIGHTS",
        text: (
            <span>
                You may, of course, decline to share certain information with
                us, in which case we may not be able to provide to you some of
                the features and functionality of the Service. From time to
                time, we send marketing e-mail messages to our users, including
                promotional material concerning our Service or Token Projects’
                services (which we believe may interest you). If you no longer
                want to receive such emails from us on a going forward basis,
                you may opt-out via the "unsubscribe" link provided in each such
                email. Please note that even if you unsubscribe from our
                marketing materials, we may continue to send you Service-related
                updates and notifications, or reply to your queries and feedback
                you provide us.
            </span>
        ),
    },
    {
        h3: "CROSS-BORDER DATA TRANSFER",
        text: (
            <span>
                Please note that we may be transferring your information outside
                of your region for storage and processing and around the globe.
                By using the Service you consent to the transfer of information
                to countries outside of your country of residence, which may
                have data protection rules that are different from those of your
                country.
            </span>
        ),
    },
    {
        h3: "UPDATES TO THIS PRIVACY POLICY",
        text: (
            <span>
                We may make changes to this Policy. The "Last Updated" date at
                the bottom of this page indicates when this Policy was last
                revised. If we make material changes, we may notify you through
                the Service or by sending you an email or other communication.
                The most current version will always be posted on our website.
                We encourage you to read this Policy periodically to stay
                up-to-date about our privacy practices. By continuing to access
                or use our Service after any revisions become effective, you
                agree to be bound by the updated Policy.
            </span>
        ),
    },
];
