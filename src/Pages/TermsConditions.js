import React from "react";

const TermsConditions = () => {
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
export default TermsConditions;

const TC_TEXTS = [
    {
        h3: "General",
        text: (
            <span>
                These terms and conditions ("Terms") govern the use of the Site
                (defined below) and the Services (defined below). These Terms
                also include any guidelines, announcements, additional terms,
                policies, and disclaimers made available or issued by us from
                time to time. These Terms constitute a binding and enforceable
                legal contract between TitanX and its affiliates ("TitanX",
                "we", "us" ) and you, an end user of the services ("you" or
                "User") at https://www.TitanX.org ("Services" ). By accessing,
                using or clicking on our website (and all related subdomains) or
                its mobile applications ("Site") or accessing, using or
                attempting to use the Services, you agree that you have read,
                understood, and are bound by these Terms and that you comply
                with the requirements listed herein. If you do not agree to all
                of these Terms or comply with the requirements herein, please do
                not access or use the Site or the Services. In addition, when
                using some features of the Services, you may be subject to
                specific additional terms and conditions applicable to those
                features. We may modify, suspend or discontinue the Site or the
                Services at any time and without notifying you. We may also
                change, update, add or remove provisions of these Terms from
                time to time. Any and all modifications or changes to these
                Terms will become effective upon publication on our Site or
                release to Users. Therefore, your continued use of our Services
                is deemed your acceptance of the modified Terms and rules. If
                you do not agree to any changes to these Terms, please do not
                access or use the Site or the Services. We note that these Terms
                between you and us do not enumerate or cover all rights and
                obligations of each party, and do not guarantee full alignment
                with needs arising from future development. Therefore, our
                privacy policy which can be viewed at the "Privacy Policy" link
                at the bottom of our Site, platform rules, guidelines and all
                other agreements entered into separately between you and us are
                deemed supplementary terms that are an integral part of these
                Terms and shall have the same legal effect. Your use of the Site
                or Services is deemed your acceptance of any supplementary terms
                too.
            </span>
        ),
    },
    {
        h3: "Eligibility",
        text: `By registering to use a TitanX account ("Account") or using the Services, you represent and warrant that: as an individual, legal person, or other organization, you have full legal capacity and authority to agree and bind yourself to these Terms; you are at least 18 or are of legal age to form a binding contract under applicable laws; your use of the Services is not prohibited by applicable law, and at all times compliant with applicable law, including but not limited to regulations on anti-money laundering, anti-corruption, and counter-terrorist financing ("CTF"); you have not been previously suspended or removed from using our Services; you do not currently have an existing Account; if you act as an employee or agents of a legal entity, and enter into these Terms on their behalf, you represent and warrant that you have all the necessary rights and authorizations to bind such legal entity; and you are solely responsible for use of the Services and, if applicable, for all activities that occur on or through your user account.`,
    },
    {
        h3: "Identity verification",
        text: (
            <span>
                Given that TitanX is a permissionless and fully decentralised
                platform for token sales, we have no role in enforcing
                anti-money laundering (“AML”) and know-your-customer checks
                (“KYC”) by default. We, however, understand the need of some
                token projects to require AML and KYC procedures on their token
                sale participants and we do provide some AML and KYC tools for
                fundraising entities using TitanX to enforce such procedures on
                their users, if the token projects choose to do so at their own
                discretion. The token projects will determine whether any user
                will satisfy the AML and KYC procedures in their absolute sole
                discretion. Please note that we cannot control, nor will we be
                liable or responsible for, the AML and KYC procedures to be
                conducted by the token projects, the safekeeping of any AML and
                KYC documentation or a breach of any AML and KYC laws, rules or
                regulations thereof, or any other act or omission pertaining to
                it and any token project’s compliance with applicable privacy
                laws or regulations. We advise you to read our privacy policy
                and the respective privacy policy of any relevant third party
                and use your best discretion. We and our affiliates may, but are
                not obligated to, collect and verify information about you in
                order to keep appropriate record of our customers, protect us
                and the community from fraudulent users, and identify traces of
                money laundering, terrorist financing, fraud and other financial
                crimes, or for other lawful purposes. All customers who wish to
                use the Services are required to establish an Account by:
                <br />
                • Providing your name, email address, phone number and country
                of residence;
                <br />
                • Certifying that you are 18 years or older; <br />
                • Accepting the terms of use and privacy policy;
                <br />
                • Verifying your identity by submitting the following
                documentation (TitanX reserves the right to request additional
                information as needed):
                <br />
                • A government-issued ID with your full name;
                <br />
                • Date of birth and social security number (or identification
                number); <br />
                • An address proof stating your current physical address; <br />
                • A selfie picture from your webcam or mobile phone. Not with
                standing the above minimum verification procedures, we may
                require you to provide or verify additional information before
                permitting you to use any Service. [Only one User can be
                registered at a time, but each individual User (including any
                User that is a business or legal entity) may maintain only one
                main Account at any given time.] We may refuse, in its sole
                discretion, to open an Account for you. We may also: (a)
                suspend, restrict, or terminate your access to any or all of the
                Services; (b) deactivate or cancel your Account; or (c)
                blacklist you from opening any future Accounts with us, if we
                reasonably suspect you of using your Account in connection with
                any prohibited use or business; your use of your Account or our
                Services is subject to any pending litigation, investigation, or
                government proceeding and/or we perceive a heightened risk of
                legal or regulatory non-compliance associated with your
                activity; or you take any action that we deem as circumventing
                our controls, including, but not limited to, opening multiple
                accounts or abusing promotions which we may offer from time to
                time. In addition to providing such information, you agree to
                allow us to keep a record of that information during the period
                for which your account is active and within five (5) years after
                your account is closed. You also authorize us to share your
                submitted information and documentation to third parties to
                verify the authenticity of such information. We may also conduct
                necessary investigations directly or through a third party to
                verify your identity or protect you and/or us from financial
                crimes, such as fraud, and to take necessary action based on the
                results of such investigations. We will collect, use and share
                such information in accordance with our privacy policy. After
                registration, you must ensure that the information is true,
                complete, and timely updated when changed. If there are any
                grounds for believing that any of the information you provided
                is incorrect, false, outdated or incomplete, we reserve the
                right to send you a notice to demand correction, directly delete
                the relevant information, and as the case may be, terminate all
                or part of the Services we provide for you. You shall be fully
                liable for any loss or expense caused to us during your use of
                the Services. You hereby acknowledge and agree that you have the
                obligation to keep all the information accurate, update and
                correct at all times. We reserve the right to confiscate any and
                all funds that are found to be in violation of relevant and
                applicable AML or CFT laws and regulations, and to cooperate
                with the competent authorities when and if necessary.
            </span>
        ),
    },
    {
        h3: "Restrictions",
        text: (
            <span>
                You shall not use the Services in any manner except as expressly
                permitted in these Terms. Without limiting the generality of the
                preceding sentence, you may NOT: Use the Services in any
                dishonest or unlawful manner, for fraudulent or malicious
                activities, or in any manner inconsistent with these Terms;
                Violate applicable laws or regulations in any manner; Infringe
                any proprietary rights, including but not limited to copyrights,
                patents, trademarks, or trade secrets of TitanX; Use the
                Services to transmit any data or send or upload any material
                that contains viruses, Trojan horses, worms, time-bombs,
                keystroke loggers, spyware, adware, or any other harmful
                programmes or computer code designed to adversely affect the
                operation of any computer software or hardware; Use any deep
                linking, web crawlers, bots, spiders or other automatic devices,
                programs, scripts, algorithms or methods, or any similar or
                equivalent manual processes to access, obtain, copy, monitor,
                replicate or bypass the Site or the Services; Make any back-up
                or archival copies of the Site or any part thereof, including
                disassembling or de-compilation of the Site; Violate public
                interests, public morals, or the legitimate interests of others,
                including any actions that would interfere with, disrupt,
                negatively affect, or prohibit other Users from using the
                Services; Use the Services for market manipulation (such as pump
                and dump schemes, wash trading, self-trading, front running,
                quote stuffing, and spoofing or layering, regardless of whether
                prohibited by law); Attempt to access any part or function of
                the Site without authorization, or connect to the Site or
                Services or any TitanX servers or any other systems or networks
                of any the Services provided through the services by hacking,
                password mining or any other unlawful or prohibited means;
                Probe, scan or test the vulnerabilities of the Site or Services
                or any network connected to the properties, or violate any
                security or authentication measures on the Site or Services or
                any network connected thereto; Reverse look-up, track or seek to
                track any information of any other Users or visitors of the Site
                or Services; Use any devices, software or routine programs to
                interfere with the normal operation of any transactions of the
                Site or Services, or any other person’s use of the Site or
                Services; or Forge headers, impersonate, or otherwise manipulate
                identification, to disguise your identity or the origin of any
                messages or transmissions you send to TitanX or the Site. By
                accessing the Services, you agree that we have the right to
                investigate any violation of these Terms, unilaterally determine
                whether you have violated these Terms, and take actions under
                relevant regulations without your consent or prior notice.
            </span>
        ),
    },
    {
        h3: "Termination",
        text: (
            <span>
                TitanX may terminate, suspend, or modify your access to the
                Services, or any portion thereof, immediately and at any point,
                at its sole discretion. TitanX will not be liable to you or to
                any third party for any termination, suspension, or modification
                of your access to the Services. Upon termination of your access
                to the Services, these Terms shall terminate, except for those
                clauses that expressly or are intended to survive termination or
                expiry.
            </span>
        ),
    },
    {
        h3: "Disclaimers",
        text: (
            <span>
                OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS
                WITHOUT ANY REPRESENTATION OR WARRANTY, WHETHER EXPRESS, IMPLIED
                OR STATUTORY. YOU HEREBY ACKNOWLEDGE AND AGREE THAT YOU HAVE NOT
                RELIED UPON ANY OTHER STATEMENT OR AGREEMENT, WHETHER WRITTEN OR
                ORAL, WITH RESPECT TO YOUR USE AND ACCESS OF THE SERVICES. TO
                THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SPECIFICALLY
                DISCLAIMS ANY IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND/OR NON-INFRINGEMENT. TitanX
                DOES NOT MAKE ANY REPRESENTATIONS OR WARRANTIES THAT ACCESS TO
                THE SITE, ANY PART OF THE SERVICES, INCLUDING MOBILE SERVICES,
                OR ANY OF THE MATERIALS CONTAINED THEREIN, WILL BE CONTINUOUS,
                UNINTERRUPTED, TIMELY, OR ERROR-FREE AND WILL NOT BE LIABLE FOR
                ANY LOSSES RELATING THERETO. TitanX DOES NOT REPRESENT OR
                WARRANT THAT THE SITE, THE SERVICES OR ANY MATERIALS OF TitanX
                ARE ACCURATE, COMPLETE, RELIABLE, CURRENT, ERROR-FREE, OR FREE
                OF VIRUSES OR OTHER HARMFUL COMPONENTS. TO THE MAXIMUM EXTENT
                PERMITTED BY APPLICABLE LAW, NONE OF TitanX OR ITS AFFILIATES
                AND THEIR RESPECTIVE SHAREHOLDERS, MEMBERS, DIRECTORS, OFFICERS,
                EMPLOYEES, ATTORNEYS, AGENTS, REPRESENTATIVES, SUPPLIERS OR
                CONTRACTORS WILL BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL,
                INCIDENTAL, INTANGIBLE OR CONSEQUENTIAL LOSSES OR DAMAGES
                ARISING OUT OF OR RELATING TO: ANY PERFORMANCE OR
                NON-PERFORMANCE OF THE SERVICES, OR ANY OTHER PRODUCT, SERVICE
                OR OTHER ITEM PROVIDED BY OR ON BEHALF OF TitanX OR ITS
                AFFILIATES; ANY AUTHORIZED OR UNAUTHORIZED USE OF THE SITE OR
                SERVICES, OR IN CONNECTION WITH THIS AGREEMENT; ANY INACCURACY,
                DEFECT OR OMISSION OF ANY DATA OR INFORMATION ON THE SITE; ANY
                ERROR, DELAY OR INTERRUPTION IN THE TRANSMISSION OF SUCH DATA;
                ANY DAMAGES INCURRED BY ANY ACTIONS, OMISSIONS OR VIOLATIONS OF
                THESE TERMS BY ANY THIRD PARTIES; OR ANY DAMAGE CAUSED BY
                ILLEGAL ACTIONS OF OTHER THIRD PARTIES OR ACTIONS WITHOUT
                AUTHORIZED BY TitanX. EVEN IF TitanX KNEW OR SHOULD HAVE KNOWN
                OF THE POSSIBILITY OF SUCH DAMAGES AND NOTWITHSTANDING THE
                FAILURE OF ANY AGREED OR OTHER REMEDY OF ITS ESSENTIAL PURPOSE,
                EXCEPT TO THE EXTENT OF A FINAL JUDICIAL DETERMINATION THAT SUCH
                DAMAGES WERE A RESULT OF OUR GROSS NEGLIGENCE, ACTUAL FRAUD,
                WILLFUL MISCONDUCT OR INTENTIONAL VIOLATION OF LAW OR EXCEPT IN
                JURISDICTIONS THAT DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
                INCIDENTAL OR CONSEQUENTIAL DAMAGES. THIS PROVISION WILL SURVIVE
                THE TERMINATION OF THESE TERMS. WE MAKE NO WARRANTY AS TO THE
                MERIT, LEGALITY OR JURIDICAL NATURE OF ANY TOKEN SOLD ON OUR
                PLATFORM (INCLUDING WHETHER OR NOT IT IS CONSIDERED A SECURITY
                OR FINANCIAL INSTRUMENT UNDER ANY APPLICABLE SECURITIES LAWS).
            </span>
        ),
    },
    {
        h3: "Intellectual property",
        text: (
            <span>
                All present and future copyright, title, interests in and to the
                Services, registered and unregistered trademarks, design rights,
                unregistered designs, database rights and all other present and
                future intellectual property rights and rights in the nature of
                intellectual property rights that exist in or in relation to the
                use and access of the Site and the Services are owned by or
                otherwise licensed to TitanX. Subject to your compliance with
                these Terms, we grant you a non-exclusive, non-sub license, and
                any limited license to merely use or access the Site and the
                Services in the permitted hereunder. Except as expressly stated
                in these Terms, nothing in these Terms should be construed as
                conferring any right in or license to our or any other third
                party’s intellectual rights. If and to the extent that any such
                intellectual property rights are vested in you by operation of
                law or otherwise, you agree to do any and all such acts and
                execute any and all such documents as we may reasonably request
                in order to assign such intellectual property rights back to us.
                You agree and acknowledge that all content on the Site must not
                be copied or reproduced, modified, redistributed, used, created
                for derivative works, or otherwise dealt with for any other
                reason without being granted a written consent from us. Third
                parties participating on the Site may permit us to utilize
                trademarks, copyrighted material, and other intellectual
                property associated with their businesses. We will not warrant
                or represent that the content of the Site does not infringe the
                rights of any third party.
            </span>
        ),
    },
    {
        h3: "Independent Parties",
        text: (
            <span>
                TitanX is an independent contractor but not an agent of you in
                the performance of these Terms. These Terms shall not be
                interpreted as facts or evidence of an association, joint
                venture, partnership or franchise between the parties.
            </span>
        ),
    },
    {
        h3: "Confidentiality",
        text: (
            <span>
                You acknowledge that the Services contain TitanX and its
                affiliates’ trade secrets and confidential information. You
                agree to hold and maintain the Services in confidence, and not
                to furnish any other person any confidential information of the
                Services or the Site. You agree to use a reasonable degree of
                care to protect the confidentiality of the Services. You will
                not remove or alter any of TitanX or its affiliates’ proprietary
                notices. Your obligations under this provision will continue
                even after these Terms have expired or been terminated.
            </span>
        ),
    },
    {
        h3: "Anti-Money Laundering",
        text: (
            <span>
                TitanX expressly prohibits and rejects the use of the Site or
                the Services for any form of illicit activity, including money
                laundering, terrorist financing or trade sanctions violations.
                By using the Site or the Services, you represent that you are
                not involved in any such activity.
            </span>
        ),
    },
    {
        h3: "Indemnification",
        text: (
            <span>
                You agree to indemnify and hold harmless TitanX and its
                affiliates and their respective shareholders, members,
                directors, officers, employees, attorneys, agents,
                representatives, suppliers or contractors from and against any
                potential or actual claims, actions, proceedings,
                investigations, demands, suits, costs, expenses and damages
                (including attorneys’ fees, fines or penalties imposed by any
                regulatory authority) arising out of or related to: your use of,
                or conduct in connection with, the Site or Services; your breach
                or our enforcement of these Terms; or your violation of any
                applicable law, regulation, or rights of any third party during
                your use of the Site or Services. If you are obligated to
                indemnify TitanX and its affiliates and their respective
                shareholders, members, directors, officers, employees,
                attorneys, agents, representatives, suppliers or contractors
                pursuant to these Terms, TitanX will have the right, in its sole
                discretion, to control any action or proceeding and to determine
                whether TitanX wishes to settle, and if so, on what terms. Your
                obligations under this indemnification provision will continue
                even after these Terms have expired or been terminated.
            </span>
        ),
    },
    {
        h3: "Force Majeure",
        text: (
            <span>
                TitanX shall have no liability to you if it is prevented from or
                delayed in performing its obligations or from carrying on its
                Services and business, by acts, events, omissions or accidents
                beyond its reasonable control, including, without limitation,
                strikes, failure of a utility service or telecommunications
                network, act of God, war, riot, civil commotion, malicious
                damage, compliance with any law or governmental order, rule,
                regulation, or direction.
            </span>
        ),
    },
    {
        h3: "Jurisdiction and Governing Law",
        text: (
            <span>
                This Agreement, and any dispute or claim (including
                non-contractual disputes or claims) arising out of or in
                connection with it or its subject matter or formation, shall be
                governed by, and construed in accordance with, the laws of
                England. Each Party irrevocably agrees that the courts of
                England shall have exclusive jurisdiction to settle any dispute
                or claim (including non-contractual disputes or claims) arising
                out of or in connection with this Agreement or its subject
                matter or formation.{" "}
            </span>
        ),
    },
    {
        h3: "Severability",
        text: (
            <span>
                If any provision of these Terms is determined by any court or
                other competent authority to be unlawful or unenforceable, the
                other provisions of these Terms will continue in effect. If any
                unlawful or unenforceable provision would be lawful or
                enforceable if part of it were deleted, that part will be deemed
                to be deleted, and the rest of the provision will continue in
                effect (unless that would contradict the clear intention of the
                clause, in which case the entirety of the relevant provision
                will be deemed to be deleted).
            </span>
        ),
    },
    {
        h3: "Notices",
        text: (
            <span>
                All notices, requests, demands, and determinations for us under
                these Terms (other than routine operational communications)
                shall be sent to support@TitanX .
            </span>
        ),
    },
    {
        h3: "Assignment",
        text: (
            <span>
                You may not assign or transfer any right to use the Services or
                any of your rights or obligations under these Terms without
                prior written consent from us, including any right or obligation
                related to the enforcement of laws or the change of control. We
                may assign or transfer any or all of its rights or obligations
                under these Terms, in whole or in part, without notice or
                obtaining your consent or approval.
            </span>
        ),
    },
    {
        h3: "Third Party Rights",
        text: (
            <span>
                No third party shall have any rights to enforce any terms
                contained herein.
            </span>
        ),
    },
    {
        h3: "Third Party Website Claimer",
        text: (
            <span>
                Any links to third party websites from our Services does not
                imply endorsement by us of any product, service, information or
                disclaimer presented therein, nor do we guarantee the accuracy
                of the information contained on them. If you suffer loss from
                using such third party product and service, we will not be
                liable for such loss. In addition, since we have no control over
                the terms of use or privacy policies of third-party websites,
                you should carefully read and understand those policies. BY
                MAKING USE OF OUR SERVICES, YOU ACKNOWLEDGE AND AGREE THAT: (A)
                YOU ARE AWARE OF THE RISKS ASSOCIATED WITH TRANSACTIONS OF
                ENCRYPTED OR DIGITAL TOKENS OR CRYPTOCURRENCIES WITH A CERTAIN
                VALUE THAT ARE BASED ON BLOCKCHAIN AND CRYPTOGRAPHY TECHNOLOGIES
                AND ARE ISSUED AND MANAGED IN A DECENTRALIZED FORM ("DIGITIAL
                CURRENCIES”); (B) YOU SHALL ASSUME ALL RISKS RELATED TO THE USE
                OF THE SERVICES AND TRANSACTIONS OF DIGITAL CURRENCIES; AND (C)
                TitanX SHALL NOT BE LIABLE FOR ANY SUCH RISKS OR ADVERSE
                OUTCOMES. AS WITH ANY ASSET, THE VALUES OF DIGITAL CURRENCIES
                ARE VOLATILE AND MAY FLUCTUATE SIGNIFICANTLY AND THERE IS A
                SUBSTANTIAL RISK OF ECONOMIC LOSS WHEN PURCHASING, HOLDING OR
                INVESTING IN DIGITAL CURRENCIES.
            </span>
        ),
    },
    {
        h3: "Disclaimer",
        text: (
            <span>
                The information provided shall not in any way constitute a
                recommendation as to whether you should invest in any product
                discussed. We accept no liability for any loss occasioned to any
                person acting or refraining from action as a result of any
                material provided or published. © 2022 by TitanX
            </span>
        ),
    },
];
